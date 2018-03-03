import { guid, StringMap } from "lib/utils"

import { File } from "./api"

function addAndSetParent(
  files: StringMap<File>,
  paths: StringMap<string>,
  file: File,
  parentPath?: string
) {
  if (parentPath) {
    const parent = paths[parentPath]
    if (!parent) {
      throw new Error("No file found with path " + parentPath)
    }
    file.parent = parent
    paths[parentPath + "/" + file.name] = file.id
  } else {
    paths[file.name] = file.id
  }
  files[file.id] = file
}

export const files = (original?: StringMap<File>) => {
  const files: StringMap<File> = original ? { ...original } : {}
  const paths: StringMap<string> = {}

  const result = {
    source(name: string, content: string, parentPath?: string) {
      const file: File = { id: guid(), type: "file", name, content }
      addAndSetParent(files, paths, file, parentPath)
      return result
    },
    folder(name: string, parentPath?: string) {
      const file: File = { id: guid(), type: "folder", name }
      addAndSetParent(files, paths, file, parentPath)
      return result
    },
    get() {
      return files
    }
  }
  return result
}
