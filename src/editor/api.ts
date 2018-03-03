import { ModuleActions } from "api"
import * as projects from "projects"

// # Sources

export interface SourcesState {
  opened: string[]
  selected: string[]
}

export interface SourcesActions {
  open(sources: string | string[], clearOpened?: boolean)
  close(sources: string | string[])
  closeAll()
  select(source: string | null)
}

// # Files

// ## State

export interface FilesState {
  // TODO
}

// ## Actions

export interface CreateFilePayload {
  type: "file" | "folder"
  name: string
  parent?: projects.File
}

export interface SetContentPayload {
  path: string
  content: string
}

export interface FilesActions {
  toggleExpanded(path: string)
  create(file: CreateFilePayload): Promise<void>
  delete(file: string | projects.File): Promise<void>
  preview(file: string | projects.File)
  setContent(source: SetContentPayload)
}

// # State

export type Status = "closed" | "loading" | "editing" | "error"

export interface State {
  project?: projects.Details
  status: Status
  files: FilesState
  localStore: projects.State
  sources: SourcesState
}

// # Actions

export interface Actions extends ModuleActions<State> {
  files: FilesActions
  localStore: projects.Actions
  sources: SourcesActions
  open(project: projects.Project)
  close()
  submitEdits(): Promise<void>
  setOwner(owner: projects.Owner): Promise<void>
  saveAllSources(): Promise<void>
  run(debug: boolean): Promise<void>
  importProjects(projects: string[]): Promise<void>
}
