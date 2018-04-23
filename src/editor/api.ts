import { StringMap } from "lib/utils"

import { ModuleActions } from "api"
import * as projects from "projects"
import { FileTree } from "projects/fileTree"

import * as debug from "./debug"
import * as sources from "./sources"
import * as ui from "./ui"

export interface FileNotFound {
  notFound: true
  path: string
}

// # State

export interface Diagnostic {
  message: string
  category: DiagnosticCategory
  start?: number
  length?: number
}

export enum DiagnosticCategory {
  Warning = 0,
  Error = 1,
  Message = 2
}

export interface CompiledModule {
  fileId: string
  diagnostics: Diagnostic[]
}

export interface CompilationOutput {
  loading: boolean
  success: boolean
  iframeSource?: string
  error?: string
  compiledModules?: StringMap<CompiledModule>
}

export type Status = "closed" | "loading" | "editing" | "read-only" | "error"

export interface State {
  compilationOutput?: CompilationOutput
  debug: debug.State
  files: projects.FileTree
  localStore: projects.State
  monacoLoaded?: boolean
  project?: projects.Details
  status: Status
  sources: sources.State
  ui: ui.State
}

// # Actions

export interface CreateFilePayload {
  type: "file" | "folder"
  name: string
  parent?: projects.File
}

export interface SetFileContentPayload {
  path: string
  content: string
}

export interface ImportNpmPackagePayload {
  name: string
  version?: string
}

export interface Actions extends ModuleActions<State> {
  // ## Sub-modules
  debug: debug.Actions
  localStore: projects.Actions
  sources: sources.Actions
  ui: ui.Actions
  // ## Project
  open(project: projects.Project)
  close()
  submitEdits(): Promise<void>
  setOwner(owner: projects.Owner): Promise<void>
  saveAllSources(): Promise<void>
  run(debug: boolean): Promise<void>
  importProjects(projects: string[]): Promise<void>
  importNpmPackage(payload: ImportNpmPackagePayload): Promise<void>
  // ## Files
  toggleFileExpanded(path: string)
  createFile(file: CreateFilePayload): Promise<void>
  deleteFile(file: projects.FileNode): Promise<void>
  previewFile(file: string | projects.File)
  setFileContent(source: SetFileContentPayload)
}
