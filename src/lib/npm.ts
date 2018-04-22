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
