import { StringMap, debounce } from "./utils"
// see https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md

// only the tiny format
/** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format */
export interface PackageMetadata {
  name: string
  modified: string
  "dist-tags": StringMap<string>
  versions: StringMap<VersionMetadata>
}

/** See https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-version-object */
export interface VersionMetadata {
  /** The name of the package */
  name: string
  version: string
  deprecated: boolean
  dependencies: any
  optionalDependencies: any
  devDependencies: any
  // will add more when we need them.
}

export function getVersions(npmPackage: string): Promise<string[]> {
  return fetch(`https://registry.npmjs.org/${npmPackage}`, {
    headers: {
      "content-type":
        "application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*"
    }
  })
    .then(response => response.json() as Promise<PackageMetadata>)
    .then(md => {
      return Object.keys(md.versions).sort()
    })
}
