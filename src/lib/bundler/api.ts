import { PackageJson } from "../npm"

export interface Dependencies {
  [name: string]: string
}

export interface Package {
  /** file paths to their content. */
  files: { [file: string]: string }
  mainFile: string
  dependencies: Dependencies
  peerDependencies: Dependencies
  unresolved: Dependencies
  json: PackageJson
}

export interface Packages {
  [name: string]: {
    [version: string]: Package
  }
}

export interface Bundle {
  name: string
  version: string
  packages: Packages
}
