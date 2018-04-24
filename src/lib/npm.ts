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
