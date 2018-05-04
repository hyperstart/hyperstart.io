import * as form from "lib/form/api"
import * as search from "lib/search/api"
import * as projects from "projects/api"

// # State

export interface ImportProjectDialog {
  search: search.State
  selected?: string
}

export interface State {
  selectedViewPaneTab: string
  importProjectDialog?: ImportProjectDialog
  importNpmPackageModal?: form.State
  shortcutsModal?: boolean
}

// # Actions

export interface Actions {
  // ## Import project modal
  importProjectDialog: {
    search: search.Actions
  }
  openImportProjectDialog()
  selectImportedProject(projectId: string)
  closeImportProjectDialog()
  // ## Import Npm Package modal
  importNpmPackageModal: form.Actions
  openImportNpmPackageModal()
  closeImportNpmPackageModal()
  // ## View pane's tabs
  selectViewPaneTab(tab: string | null)
  // ## Shortcut modal
  showShortcutsModal()
  hideShortcutsModal()
  // ## Create file modal
  createFileModal: form.Actions
  openCreateFileModal(path: string)
  closeCreateFileModal()
  // ## Delete file modal
  openDeleteFileModal(file: string)
  closeDeleteFileModal()
  // ## Previewed file
  previewFile(fileId: string | null)
}
