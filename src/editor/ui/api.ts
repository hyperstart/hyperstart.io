import * as form from "lib/form/api"
import * as search from "lib/search/api"
import { PackageMetadata } from "lib/npm"

import * as projects from "projects/api"
import { FileTree, FileNode } from "projects/fileTree"

// # State

export interface ImportProjectDialog {
  search: search.State
  selected?: string
}

export interface AddPackageDependencyState {
  input: string
  versions: string[]
  version?: string
  loading?: boolean
  error?: string
}

export type AddDependencyTab = "project" | "package"

export interface AddDependencyModal {
  selectedTab: AddDependencyTab
  projectSearch: search.State
  selectedProject?: string
  package: AddPackageDependencyState
}

export interface State {
  selectedViewPaneTab: string
  editForm?: form.State
  createFileDialog?: form.State
  importProjectDialog?: ImportProjectDialog
  deletingFile?: FileNode
  selectedFile?: string
  previewedFile?: string
  shortcutsModal?: boolean
  addDependencyModal?: AddDependencyModal
}

// # Actions

export interface OpenFileModalPayload {
  type: projects.FileType
  parent?: FileNode
}

export interface SetPackagesStatePayload {
  version?: string
  loading?: boolean
  error?: string
  versions?: string[]
}

export interface AddPackageDependencyActions {
  setInput(value: string)
  set(payload: SetPackagesStatePayload)
}

export interface AddDependencyModalActions {
  projectsSearch: search.Actions
  package: AddPackageDependencyActions
  selectTab(tab: AddDependencyTab)
}

export interface Actions {
  // ## Edit form
  editForm: form.Actions
  startEdit(project: projects.Details)
  stopEdit()
  // ## Import project dialog
  importProjectDialog: {
    search: search.Actions
  }
  openImportProjectDialog()
  selectImportedProject(projectId: string)
  closeImportProjectDialog()
  // ## Delete file modal
  openDeleteFileModal(file: FileNode)
  closeDeleteFileModal()
  // ## Create file modal
  createFileDialog: form.Actions
  openCreateFileModal(payload: OpenFileModalPayload)
  closeCreateFileModal()
  // ## Selected file
  select(fileId: string | null)
  // ## Previewed file
  preview(fileId: string | null)
  // ## View pane's tabs
  selectViewPaneTab(tab: string | null)
  // ## Shortcut modal
  showShortcutsModal()
  hideShortcutsModal()
  // # Add Dependency modal
  addDependencyModal: AddDependencyModalActions
  openAddDependencyModal()
  closeAddDependencyModal()
}
