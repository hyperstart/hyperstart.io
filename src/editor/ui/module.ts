import { ModuleImpl } from "lib/modules"
import { get, merge, set } from "lib/immutable"
import { createForm, createFormState } from "lib/form/module"
import { createSearch } from "lib/search/module"
import { logEvent } from "analytics"

import * as projects from "projects"

import { PROJECT_TAB_ID } from "../constants"
import * as api from "./api"
import { debounce } from "lib/utils"

const createFileForm = createForm()
const editForm = createForm()
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
    // ## Import project dialog
    importProjectDialog: {
      search: search.actions
    },
    openImportProjectDialog: () => {
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
    // ## View pane's tabs
    selectViewPaneTab: (selectedViewPaneTab: string | null) => {
      return { selectedViewPaneTab }
    },
    // ## Shortcut modal
    showShortcutsModal: () => ({ shortcutsModal: true }),
    hideShortcutsModal: () => ({ shortcutsModal: false }),
    // ## Create file modal
    createFileModal: createFileForm.actions,
    openCreateFileModal: (path: string) => {
      return {
        createModal: {
          path: { value: path, original: path }
        }
      }
    },
    closeCreateFileModal: () => {
      return { createModal: null }
    },
    // ## Delete file modal
    openDeleteFileModal: (deletingFile: string) => {
      return { deletingFile }
    },
    closeDeleteFileModal: () => state => {
      return { deletingFile: null }
    },
    // ## Previewed file
    previewFile: (previewedFile: string | null) => state => {
      return { previewedFile }
    }
  }
}
