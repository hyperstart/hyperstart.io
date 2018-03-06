import { FileTree } from "projects/fileTree"
import * as projects from "projects/api"

// # State

export interface State {
  files: FileTree
}

// # Actions

export interface CreatePayload {
  type: "file" | "folder"
  name: string
  parent?: projects.File
}

export interface SetContentPayload {
  path: string
  content: string
}

export interface Actions {
  toggleExpanded(path: string)
  create(file: CreatePayload): Promise<void>
  delete(file: string | projects.File): Promise<void>
  preview(file: string | projects.File)
  setContent(source: SetContentPayload)
}
