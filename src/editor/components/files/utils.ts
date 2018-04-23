import { FolderNode } from "projects/fileTree"
import { DEPENDENCIES_FOLDER_NAME } from "projects"

export function isRootDependenciesFolder(item: FolderNode): boolean {
  return item.name === DEPENDENCIES_FOLDER_NAME && !item.parent
}
