import * as semver from "semver"

import { get } from "lib/unpkg"
import { resolveId } from "./resolveId"
import { Bundle, Package } from "./api"
import { PackageJson, inferMainFile } from "../npm"

const LOADING = "___LOADING___"

// # Remove comments
const commentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm

function removeComments(code: string): string {
  return code.replace(commentsRegex, "$1")
}

// # Get Esm Imports

const esmRegex = /[import|export]\s+([\s{}\w-\*,$]+)\s+from\s+["|']([\w-\./]+)["|']\s*/g

function getEsmImports(code: string): string[] {
  const result = []
  let exec
  while ((exec = esmRegex.exec(code)) !== null) {
    if (!exec || !exec[2]) {
      break
    }
    result.push(exec[2])
  }

  return result
}

// # Get Commonjs Imports

const requireRegex = /require\(["|']([\w-\./]+)["|']\)/g

function getCommonJsImports(code: string): string[] {
  const result = []
  let exec
  while ((exec = requireRegex.exec(code)) !== null) {
    if (!exec || !exec[1]) {
      break
    }
    result.push(exec[1])
  }

  return result
}

// # Utils

function addPkg(bundle: Bundle, json: PackageJson): Package {
  if (!bundle.packages[json.name]) {
    bundle.packages[json.name] = {}
  }
  const packages = bundle.packages[json.name]

  if (packages[json.version]) {
    return packages[json.version]
  }

  packages[json.version] = {
    json,
    mainFile: null,
    files: {},
    dependencies: {},
    peerDependencies: {},
    unresolved: {}
  }

  return packages[json.version]
}

function inferVersion(semver: string): string | null {
  let result = semver.trim()
  if (result.startsWith("v")) {
    result = result.substr(1)
  }

  // not supported
  if (result === "*" || result.startsWith(">") || result.includes("x")) {
    return null
  }

  if (result.startsWith("<=")) {
    return result.substr(2)
  }

  if (result.startsWith("^") || result.startsWith("~")) {
    return result.substr(1)
  }

  return result
}

export function getPkg(
  bundle: Bundle,
  name: string,
  version: string
): Package | null {
  const versions = bundle.packages[name]
  if (!versions) {
    return null
  }
  for (const v of Object.keys(versions)) {
    if (semver.satisfies(v, version, true)) {
      return versions[v]
    }
  }
  return null
}

interface ResolvedDependency {
  name: string
  version: string
  isPeer: boolean
  file?: string
}

function createResolved(
  name: string,
  version: string,
  isPeer: boolean,
  file?: string
): ResolvedDependency {
  const result: ResolvedDependency = {
    name,
    version,
    isPeer
  }
  if (file) {
    result.file = !hasExtension(file) ? file + ".js" : file
  }

  return result
}

function resolveDependency(
  pkg: PackageJson,
  dependency: string,
  file?: string
): ResolvedDependency {
  if (pkg.peerDependencies && pkg.peerDependencies[dependency]) {
    const version = pkg.peerDependencies[dependency]
    return createResolved(dependency, version, true, file)
  }
  if (pkg.dependencies && pkg.dependencies[dependency]) {
    const version = pkg.dependencies[dependency]
    return createResolved(dependency, version, false, file)
  }

  if (!dependency.includes("/")) {
    return null
  }

  const segments = dependency.split("/")
  const last = segments.pop()

  return resolveDependency(
    pkg,
    segments.join("/"),
    file ? last + "/" + file : last
  )
}

function hasExtension(file: string) {
  const dot = file.lastIndexOf(".")
  const slash = file.lastIndexOf("/")
  return dot >= 0 && dot > slash
}

function cleanup(bundle: Bundle): Bundle {
  // removes all the files[path] = LOADING of all the packages
  Object.keys(bundle.packages).forEach(name => {
    const versions = bundle.packages[name]
    Object.keys(versions).forEach(version => {
      const pkg = versions[version]

      Object.keys(pkg.files).forEach(key => {
        if (pkg.files[key] === LOADING) {
          delete pkg.files[key]
        }
      })
    })
  })

  return bundle
}

// # Crawl

function crawl(context: Context, pkg: PackageJson, file: string): Promise<any> {
  file = file.startsWith("/") ? file : "/" + file

  // check if already crawled
  if (isVisited(context, pkg.name, pkg.version, file)) {
    return Promise.resolve()
  }

  // console.log(`Crawling "${file}" in package ${pkg.name}@${pkg.version}...`)

  setVisited(context, pkg.name, pkg.version, file)
  return get({ pkg: pkg.name, version: pkg.version, file }).then(res => {
    // console.log(
    //   `Downloaded "${file}" (response "${JSON.stringify(res)}") in package ${
    //     pkg.name
    //   }@${pkg.version}...`
    // )

    if (file !== res.file) {
      // got a redirect
      file = res.file
      setVisited(context, pkg.name, pkg.version, file)
    }
    if (!hasExtension(file)) {
      // no redirect, but we get the content of the corresponding ".js" file
      file = file + ".js"
      setVisited(context, pkg.name, pkg.version, file)
      // console.log(`Added extension to ${file}`)
    }

    // update the bundles
    const currentPkg = getPkg(context.bundle, pkg.name, pkg.version)
    currentPkg.files[file] = res.content

    // stop recursion for non javascript sources
    if (!file.endsWith(".js")) {
      return Promise.resolve([])
    }

    // recursive call
    const rawCode = removeComments(res.content)
    const deps = getEsmImports(rawCode)
    if (deps.length === 0) {
      // a package is either only es2015 or only commonjs
      deps.push(...getCommonJsImports(rawCode))
    }

    return Promise.all(
      deps.map(dep => {
        const resolved = resolveId(dep, file)
        if (resolved.startsWith("/")) {
          // file in the same package
          // console.log(
          //   `File "${file}" requires local dependeny "${dep}" resolved to "${resolved}" in ${
          //     pkg.name
          //   }@${pkg.version}, starting to crawl...`
          // )
          return crawl(context, pkg, resolved)
        } else {
          // dependency to another package
          const d = resolveDependency(pkg, resolved)

          // console.log(
          //   `File "${file}" requires "${dep}" resolved to "${JSON.stringify(
          //     d
          //   )}" in ${pkg.name}@${pkg.version}, starting to crawl...`
          // )

          if (!d) {
            currentPkg.unresolved[resolved] = "*"
          } else if (d.isPeer) {
            currentPkg.peerDependencies[d.name] = d.version
          } else {
            currentPkg.dependencies[d.name] = d.version
            return bundleInternal(d.name, d.version, context, d.file)
          }
          return Promise.resolve()
        }
      })
    )
  })
}

// # Internal Bunble

interface VisitedPackages {
  [name: string]: {
    [version: string]: {
      [file: string]: boolean
    }
  }
}

interface Context {
  bundle: Bundle
  visited: VisitedPackages
}

function setVisited(
  context: Context,
  pkg: string,
  version: string,
  file?: string
) {
  if (!context.visited[pkg]) {
    context.visited[pkg] = {}
  }
  if (!context.visited[pkg][version]) {
    context.visited[pkg][version] = {}
  }
  if (file) {
    context.visited[pkg][version][file] = true
  }
}

function isVisited(
  context: Context,
  pkg: string,
  version: string,
  file?: string
): boolean {
  const files = (context.visited[pkg] || {})[version]
  return file ? (files || {})[file] : !!files
}

function bundleInternal(
  pkg: string,
  version: string,
  context: Context,
  file: string
): Promise<any> {
  if (isVisited(context, pkg, version)) {
    return Promise.resolve()
  }

  setVisited(context, pkg, version)

  const fetches = [
    get({ pkg, version, file: "package.json" }),
    get({ pkg, version, file: "README.md" }).catch(e => null)
  ]

  return Promise.all(fetches).then(([res, readme]) => {
    if (!res.content) {
      throw new Error(
        `Cannot find package.json for package ${pkg} with version ${version}.`
      )
    }

    const json: PackageJson = JSON.parse(res.content)
    const packaged = addPkg(context.bundle, json)

    const mainFile = packaged.mainFile || inferMainFile(json)
    if (!mainFile) {
      throw new Error(
        `Could not infer the main file for package ${json.name}@${json.version}`
      )
    }

    packaged.mainFile = mainFile
    packaged.files["/package.json"] = res.content

    if (readme && readme.content) {
      packaged.files["/README.md"] = readme.content
    }

    return crawl(context, json, file || mainFile)
  })
}

// # Bundle

export function bundle(pkg: string, version?: string): Promise<Bundle> {
  const fetches = [
    get({ pkg, version, file: "package.json" }),
    get({ pkg, version, file: "README.md" }).catch(e => null)
  ]

  const context: Context = {
    bundle: {
      name: pkg,
      version,
      packages: {}
    },
    visited: {}
  }

  return Promise.all(fetches)
    .then(([res, readme]) => {
      if (!res.content) {
        throw new Error(
          `Cannot find package.json for package ${pkg} with version ${version ||
            "latest"}.`
        )
      }
      const json: PackageJson = JSON.parse(res.content)
      context.bundle.version = json.version
      const packaged = addPkg(context.bundle, json)

      const mainFile = packaged.mainFile || inferMainFile(json)
      if (!mainFile) {
        throw new Error(
          `Could not infer the main file for package ${json.name}@${
            json.version
          }`
        )
      }

      packaged.mainFile = mainFile
      packaged.files["/package.json"] = res.content

      if (readme && readme.content) {
        packaged.files["/README.md"] = readme.content
      }

      return crawl(context, json, mainFile)
    })
    .then(() => context.bundle)
}
