import { FolderNode } from "projects/fileTree"
import { DEPENDENCIES_FOLDER_NAME } from "projects"

export function isDependenciesFolder(item: FolderNode): boolean {
  if (item.name !== DEPENDENCIES_FOLDER_NAME) {
    return false
  }

  if (!item.parent) {
    return true
  }

  // TODO later on, if the parent folder is an artifact, return true
  return false
}
