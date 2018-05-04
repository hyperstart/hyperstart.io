import { Bundle, getPkg, Package } from "../lib/bundle"

import { Project, File, Files } from "./api"
import { importFiles, FilesToImport } from "./importFiles"

interface HasNameAndVersion {
  name: string
  version: string
}

function getId(bundleOrPackage: HasNameAndVersion) {
  return `${bundleOrPackage.name}@${bundleOrPackage.version || "*"}`
}

function getFilesFromBundle(
  bundle: Bundle,
  pkg: Package,
  result: Files = {},
  root: string = ""
): Files {
  // create the files
  Object.keys(pkg.files).forEach(path => {
    result[root + path] = {
      content: pkg.files[path],
      edits: 0
    }
  })

  // recursively explores the dependencies
  Object.keys(pkg.dependencies).forEach(name => {
    const version = pkg.dependencies[name]
    const dependencyPkg = getPkg(bundle, name, version)
    if (!dependencyPkg) {
      throw new Error(
        `Dependency ${name}@${version} required by package ${pkg.json.name}@${
          pkg.json.version
        } not found in bundle.`
      )
    }

    getFilesFromBundle(
      bundle,
      dependencyPkg,
      result,
      `${root}/dependencies/${name}`
    )
  })

  return result
}

function getFilesToImport(bundle: Bundle): FilesToImport {
  const pkg = getPkg(bundle, bundle.name, bundle.version)
  return {
    packageJson: pkg.json,
    files: getFilesFromBundle(bundle, pkg)
  }
}

export function importBundles(files: Files, bundles: Bundle[]): Files {
  return importFiles(files, bundles.map(getFilesToImport))
}
