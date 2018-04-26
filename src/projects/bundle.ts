import { Bundle, getPkg, Package } from "../lib/bundle"

import { Project, File, Files } from "./api"
import { getFileTree } from "./fileTree"
import { importProjects } from "./importProjects"

function getFile(path: string, content: string): File {
  const segments = path.split("/")
  const name = segments.pop()
  const result: File = {
    id: path,
    name,
    type: "file",
    content
  }
  if (segments.length > 1) {
    // path starts with "/" so segments.length >= 1
    result.parent = segments.join("/")
  }
  return result
}

function ensureParentFolder(files: Files, filePath: string): void {
  const segments = filePath.split("/")
  segments.pop() // remove file name
  // file is at the root, filePath always starts with "/"
  if (segments.length <= 1) {
    return
  }

  const path = segments.join("/")
  const name = segments.pop()
  if (files[path]) {
    if (files[path].type !== "folder") {
      throw new Error("A source file already with folder name + " + path)
    }
    return
  }

  files[path] = {
    id: path,
    name,
    type: "folder"
  }
  if (segments.length > 1) {
    // path starts with "/" so segments.length >= 1
    const parent = segments.join("/")
    files[path].parent = parent
    ensureParentFolder(files, parent)
  }
}

export function getFilesFromBundle(
  bundle: Bundle,
  pkg: Package,
  result: Files = {},
  root: string = ""
): Files {
  for (const file of Object.keys(pkg.files)) {
    result[root + file] = getFile(root + file, pkg.files[file])
    ensureParentFolder(result, root + file)
  }

  for (const dep of Object.keys(pkg.dependencies)) {
    const version = pkg.dependencies[dep]
    const dependencyPkg = getPkg(bundle, dep, version)
    if (!dependencyPkg) {
      throw new Error(
        `Dependency ${dep}@${version} required by package ${pkg.json.name}@${
          pkg.json.version
        } not found in bundle.`
      )
    }

    getFilesFromBundle(
      bundle,
      dependencyPkg,
      result,
      `${root}/dependencies/${dep}`
    )
  }

  return result
}

interface HasNameAndVersion {
  name: string
  version: string
}

function getId(bundleOrPackage: HasNameAndVersion) {
  return `${bundleOrPackage.name}@${bundleOrPackage.version || "*"}`
}

export function importBundle(bundle: Bundle, files: Files): Files {
  const pkg = getPkg(bundle, bundle.name, bundle.version)

  return importProjects(files, [
    {
      id: getId(bundle),
      name: bundle.name,
      mainFile: pkg.mainFile,
      version: pkg.json.version,
      files: getFilesFromBundle(bundle, pkg)
    }
  ])
}
