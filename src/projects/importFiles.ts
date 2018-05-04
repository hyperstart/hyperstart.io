import { concat } from "lib/fs"
import { PackageJson } from "lib/npm"

import { File, Files } from "./api"
import {
  DEPENDENCIES_FOLDER_NAME,
  DEPENDENCIES_FOLDER_PATH,
  PACKAGE_JSON_PATH
} from "./constants"
import { StringMap } from "lib/utils"

export interface FilesToImport {
  files: Files
  packageJson: PackageJson
}

export function importFiles(files: Files, toImport: FilesToImport[]): Files {
  const result: Files = {}

  // add packages
  const roots: string[] = []
  toImport.forEach(singleImport => {
    const root = concat(DEPENDENCIES_FOLDER_PATH, singleImport.packageJson.name)
    roots.push(root)

    let packageJsonImported = false
    const files = singleImport.files
    Object.keys(files).forEach(path => {
      const file = files[path]
      result[concat(root, path)] = {
        content: file.content,
        edits: 0
      }

      if (path === PACKAGE_JSON_PATH) {
        packageJsonImported = true
      }
    })

    if (!packageJsonImported) {
      result[concat(root, PACKAGE_JSON_PATH)] = {
        content: JSON.stringify(singleImport.packageJson, null, 2),
        edits: 0
      }
    }
  })

  // copy existing files across, do not copy old version of the imported package.
  Object.keys(files).forEach(path => {
    for (const root of roots) {
      if (path.startsWith(root)) {
        return
      }
    }

    result[path] = files[path]
  })

  return result
}
