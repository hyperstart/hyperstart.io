import { ModuleActions } from "api"
import * as projects from "projects"
import { FileTree } from "projects/fileTree"

import * as files from "./files/api"
import * as sources from "./sources/api"
import * as ui from "./ui/api"

export interface FileNotFound {
  notFound: true
  path: string
}

// # State

export type Status = "closed" | "loading" | "editing" | "read-only" | "error"

export interface State {
  files: files.State
  localStore: projects.State
  project?: projects.Details
  status: Status
  sources: sources.State
  ui: ui.State
}

// # Actions

export interface Actions extends ModuleActions<State> {
  files: files.Actions
  localStore: projects.Actions
  sources: sources.Actions
  ui: ui.Actions
  open(project: projects.Project)
  close()
  submitEdits(): Promise<void>
  setOwner(owner: projects.Owner): Promise<void>
  saveAllSources(): Promise<void>
  run(debug: boolean): Promise<void>
  importProjects(projects: string[]): Promise<void>
}
