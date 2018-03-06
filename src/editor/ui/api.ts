import * as form from "lib/form"
import * as projects from "projects/api"
import { FileTree, FileNode } from "projects/fileTree"

// # State

export interface ImportProjectDialog {
  selected?: string
}

export interface State {
  form: form.State
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
  actions: form.Actions
  startEdit(project: projects.Details)
  stopEdit()
  // ## Import project dialog
  openImportProjectDialog()
  selectImportedProject(projectId: string)
  closeImportProjectDialog()
  // ## Delete file modal
  openDeleteFileModal(file: FileNode)
  closeDeleteFileModal()
  // ## Create file modal
  openCreateFileModal(payload: OpenFileModalPayload)
  closeCreateFileModal()
  // ## Selected file
  select(file: string | null)
}
