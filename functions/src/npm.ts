import { maxSatisfying } from "semver"

import { fetch } from "./fetch"

// # Registry Functions

// ## Types

/**
 * Type for Map<String, T>.
 */
export interface StringMap<T = any> {
  [key: string]: T
}

// only the tiny format
/** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format */
export interface AbbreviatedPackage {
  name: string
  modified: string
  "dist-tags": StringMap<string>
  versions: StringMap<AbbreviatedVersion>
}

/** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object */
export interface AbbreviatedVersion {
  /** The name of the package */
  name: string
  version: string
  deprecated: boolean
  dependencies: any
  optionalDependencies: any
  devDependencies: any
  // will add more when we need them.
}

function getUrl(npmPackage: string, suffix: string = "") {
  return `https://registry.npmjs.org/${npmPackage}${suffix}`
}

// ## fetchAbbreviatedPackageJson

function fetchAbbreviatedPackageJson(
  npmPackage: string
): Promise<AbbreviatedPackage> {
  return fetch(getUrl(npmPackage), {
    headers: {
      "content-type":
        "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*"
    }
  })
    .then(response => response.json() as Promise<AbbreviatedPackage>)
    .then(json => {
      if (!json.versions) {
        throw new Error(`No package found with name ${npmPackage}.`)
      }
      return json
    })
}

// ## fetchVersions

export function fetchVersions(npmPackage: string): Promise<string[]> {
  return fetchAbbreviatedPackageJson(npmPackage).then(json => {
    return Object.keys(json.versions).sort()
  })
}

function resolveUrl(
  npmPackage: string,
  range: string | string[]
): Promise<string> {
  return fetchAbbreviatedPackageJson(npmPackage)
    .then(json => {
      if (range) {
        const versions = Object.keys(json.versions)
        const version = maxSatisfying(Object.keys(json.versions), String(range))
        if (!version) {
          throw new Error(
            `Cannot compute highest version, range ${String(
              range
            )}, package versions: ${String(versions)}`
          )
        }
        return version
      }

      return json["dist-tags"].latest
    })
    .then(version => getUrl(npmPackage, `/-/${npmPackage}-${version}.tgz`))
}

// # Utility functions

// ## Types

export interface PackageDependencies {
  [name: string]: string
}

export interface HyperstartJson {
  id: string
}

export interface PackageJson {
  name: string
  version: string
  files: string[]
  main?: string
  module?: string
  dependencies?: PackageDependencies
  peerDependencies?: PackageDependencies
  hyperstart?: HyperstartJson
}

// ## inferMainFile

export function inferMainFile(json: PackageJson): string | null {
  if (json.module) {
    return json.module
  } else if (json.main) {
    return json.main
  } else {
    if (json.files.length > 0) {
      const candidates: string[] = []
      for (const file of json.files) {
        if (file === "index.js") {
          return file
        }
        if (file.endsWith(".js")) {
          candidates.push(file)
        }
      }

      if (candidates.length === 1) {
        return candidates[0]
      }
    }
  }
  return null
}

// import { maxSatisfying } from "semver"
// import untar from "js-untar"

// import { StringMap } from "./utils"

// // Since npm registry does not support CORS, even on GET requests, this cannot work in the browser...
// // we'll have to run this on a cloud function...
// // See https://github.com/npm/registry/issues/110

// // only the tiny format
// /** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format */
// // it's not the package.json...
// export interface PackageJson {
//   name: string
//   modified: string
//   "dist-tags": StringMap<string>
//   versions: StringMap<VersionJson>
// }

// /** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object */
// export interface VersionJson {
//   /** The name of the package */
//   name: string
//   version: string
//   deprecated: boolean
//   dependencies: any
//   optionalDependencies: any
//   devDependencies: any
//   // will add more when we need them.
// }

// function getUrl(npmPackage: string, suffix: string = "") {
//   return `https://registry.npmjs.org/${npmPackage}${suffix}`
// }

// function fetchPackageJson(npmPackage: string): Promise<PackageJson> {
//   console.log("Fetching package json", getUrl(npmPackage))
//   return fetch(getUrl(npmPackage), {
//     headers: {
//       "content-type":
//         "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*"
//     }
//   })
//     .then(response => {
//       console.log("Reponse for json", response)
//       return response.json() as Promise<PackageJson>
//     })
//     .then(json => {
//       if (!json.versions) {
//         throw new Error(`No package found with name ${npmPackage}.`)
//       }
//       return json
//     })
// }

// export function getVersions(npmPackage: string): Promise<string[]> {
//   return fetchPackageJson(npmPackage).then(json => {
//     return Object.keys(json.versions).sort()
//   })
// }

// function resolveUrl(
//   npmPackage: string,
//   range?: string | string[]
// ): Promise<string> {
//   return fetchPackageJson(npmPackage)
//     .then(json => {
//       if (range) {
//         const versions = Object.keys(json.versions)
//         const version = maxSatisfying(Object.keys(json.versions), String(range))
//         if (!version) {
//           throw new Error(
//             `Cannot compute highest version, range ${String(
//               range
//             )}, package versions: ${String(versions)}`
//           )
//         }
//         return version
//       }

//       return json["dist-tags"].latest
//     })
//     .then(version => getUrl(npmPackage, `/-/${npmPackage}-${version}.tgz`))
// }

// export function getContent(
//   npmPackage: string,
//   range?: string | string[]
// ): Promise<void> {
//   return resolveUrl(npmPackage, range)
//     .then(url => fetch(url, { mode: "no-cors" }))
//     .then(response => {
//       console.log("got response ", response)
//       return untar(response.body)
//     })
//     .then(files => {
//       console.log("extracted files", files)
//     })
// }
