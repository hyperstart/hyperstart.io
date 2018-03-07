import * as form from "lib/form/api"
import * as search from "lib/search/api"
import * as projects from "projects/api"
import { FileTree, FileNode } from "projects/fileTree"

// # State

export interface ImportProjectDialog {
  search: search.State
  selected?: string
}

export interface State {
  editForm: form.State
  createFileModal: form.State
  importProjectDialog?: ImportProjectDialog
  deletingFile?: FileNode
  selectedFile?: string
}

// # Actions

export interface OpenFileModalPayload {
  type: projects.FileType
  parent?: FileNode
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
  createFileModal: form.Actions
  openCreateFileModal(payload: OpenFileModalPayload)
  closeCreateFileModal()
  // ## Selected file
  select(file: string | null)
}
