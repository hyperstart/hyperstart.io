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

export interface PackageJson {
  name: string
  version: string
  files: string[]
  main?: string
  module?: string
  dependencies?: Dependencies
  peerDependencies?: Dependencies
}

export interface Bundle {
  name: string
  version: string
  packages: Packages
}
