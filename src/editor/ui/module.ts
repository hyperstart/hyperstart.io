import { ModuleImpl } from "lib/modules"
import { get, merge, set } from "lib/immutable"
import { createForm, createFormState } from "lib/form/module"
import { createSearch } from "lib/search/module"
import { logEvent } from "analytics"

import * as projects from "projects"

import { PROJECT_TAB_ID } from "../constants"
import * as api from "./api"
import { debounce } from "lib/utils"

const editForm = createForm()
const createFileForm = createForm()
const importNpmPackageForm = createForm({
  name: "",
  version: [],
  latest: [
    { value: "latest", label: "Latest version" },
    { value: "custom", label: "Custom Version" }
  ]
})
const search = createSearch([{ name: "import-project" }])

export const ui: ModuleImpl<api.State, api.Actions> = {
  state: {
    selectedViewPaneTab: PROJECT_TAB_ID
  },
  actions: {
    // ## Edit form
    editForm: editForm.actions,
    startEdit: (project: projects.Details) => state => {
      return {
        editForm: createFormState({ name: project.name })
      }
    },
    stopEdit: () => state => {
      return { editForm: null }
    },
    // ## Import project dialog
    importProjectDialog: {
      search: search.actions
    },
    openImportProjectDialog: () => state => {
      logEvent("screen_view", { screen_name: "Add Dependency" })
      return {
        importProjectDialog: {
          search: search.state
        }
      }
    },
    selectImportedProject: (selected: string) => state => {
      return {
        importProjectDialog: {
          search: state.importProjectDialog.search,
          selected
        }
      }
    },
    closeImportProjectDialog: () => state => {
      return { importProjectDialog: null }
    },
    // ## Import Npm Package modal
    importNpmPackageModal: importNpmPackageForm.actions,
    openImportNpmPackageModal: () => {
      logEvent("screen_view", { screen_name: "Add npm package" })
      return {
        importNpmPackageModal: importNpmPackageForm.state
      }
    },
    closeImportNpmPackageModal: () => {
      return {
        importNpmPackageModal: null
      }
    },
    // ## Delete file modal
    openDeleteFileModal: (deletingFile: projects.FileNode) => {
      return { deletingFile }
    },
    closeDeleteFileModal: () => state => {
      return { deletingFile: null }
    },
    // ## Create file modal
    createFileDialog: createFileForm.actions,
    openCreateFileModal: (payload: api.OpenFileModalPayload) => state => {
      return {
        createFileDialog: {
          name: { value: "", original: "" },
          type: { value: payload.type, original: payload.type },
          parent: { value: payload.parent, original: payload.parent }
        }
      }
    },
    closeCreateFileModal: () => state => {
      return { createFileDialog: null }
    },
    // ## Selected file
    select: (selectedFile: string | null) => state => {
      return { selectedFile }
    },
    // ## Previewed file
    preview: (previewedFile: string | null) => state => {
      return { previewedFile }
    },
    // ## View pane's tabs
    selectViewPaneTab: (selectedViewPaneTab: string | null) => state => {
      return { selectedViewPaneTab }
    },
    // ## Shortcut modal
    showShortcutsModal: () => ({ shortcutsModal: true }),
    hideShortcutsModal: () => ({ shortcutsModal: false })
  }
}
