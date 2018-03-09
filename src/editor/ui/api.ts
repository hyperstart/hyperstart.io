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
  selectedViewPaneTab: string
  editForm?: form.State
  createFileDialog?: form.State
  importProjectDialog?: ImportProjectDialog
  deletingFile?: FileNode
  selectedFile?: string
  previewedFile?: string
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
  createFileDialog: form.Actions
  openCreateFileModal(payload: OpenFileModalPayload)
  closeCreateFileModal()
  // ## Selected file
  select(fileId: string | null)
  // ## Previewed file
  preview(fileId: string | null)
  // ## View pane's tabs
  selectViewPaneTab(tab: string | null)
}
