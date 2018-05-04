import { StringMap } from "lib/utils"

import { ModuleActions } from "api"
import * as projects from "projects"
import * as users from "users"
import * as bundles from "bundles"

import * as debug from "./debug"
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
  path: string
  diagnostics: Diagnostic[]
}

export interface CompilationOutput {
  loading: boolean
  success: boolean
  iframeSource?: string
  error?: string
  compiledModules?: StringMap<CompiledModule>
}

export interface ExpandedFolders {
  [path: string]: boolean
}

export interface FileNode {
  type: "folder" | "file"
  name: string
  path: string
  expanded?: boolean
  children?: string[]
}

export interface FileTree {
  [path: string]: FileNode
}

export type Status = "closed" | "editing" | "local-only" | "read-only"

export interface State {
  // ## Sub Modules
  debug: debug.State
  ui: ui.State
  // ## TODO should be a sub-module
  compilationOutput?: CompilationOutput
  // ## State
  status: Status
  openedSources: string[]
  selectedSources: string[]
  expandedFolders: ExpandedFolders
  original?: projects.Project
  project?: projects.Project
  projectToOpen?: projects.Project
  fileTree?: FileTree
  monacoLoaded: boolean
}

// # Actions

export interface UpdateDetailsPayload {
  name: string
}

export interface ImportNpmPackagePayload {
  name: string
  version?: string
}

export interface SetFileContentPayload {
  path: string
  content: string
}

export interface OpenFilesPayload {
  sources: string | string[]
  clearOpened?: boolean
}

export interface Actions extends ModuleActions<State> {
  // ## Sub-modules
  debug: debug.Actions
  ui: ui.Actions
  // ## Project
  open(project: projects.Project)
  close()
  fork(newOwner: projects.ProjectOwner)
  run(debug: boolean): Promise<void>
  setProjectName(name: string)
  // ## Import
  importProject(projectId: string): Promise<void>
  importNpmPackage(payload: ImportNpmPackagePayload): Promise<void>
  computeImportingNpmPackageVersions()
  // ## Files
  createFile(path: string)
  deleteFile(path: string)
  setFileContent(payload: SetFileContentPayload)
  saveProject(): Promise<void>
  // ## Editor
  openFiles(payload: OpenFilesPayload)
  closeFile(sources: string | string[])
  selectFile(source: string | null)
  closeAllFiles()
  // ## Folders
  toggleFolder(path: string)
}

export interface InternalActions extends Actions {
  _projects: projects.Actions
  _users: users.Actions
  _bundles: bundles.Actions
  _setMonacoLoaded()
  _setState(state: Partial<State>)
  _recomputeFileTree()
}
