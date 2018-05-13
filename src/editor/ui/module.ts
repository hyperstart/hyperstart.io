import { ModuleImpl } from "lib/modules"
import { get, merge, set } from "lib/immutable"
import { createForm, createFormState } from "lib/form/module"
import { createSearch } from "lib/search/module"
import { logEvent } from "analytics"

import * as projects from "projects"

import * as api from "./api"
import { debounce } from "lib/utils"
import { ROOT_PATH } from "projects"

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
  state: {},
  actions: {
    // ## Import project dialog
    importProjectModal: {
      search: search.actions
    },
    openImportProjectModal: () => {
      logEvent("screen_view", { screen_name: "Add Dependency" })
      return {
        importProjectModal: {
          search: search.state
        }
      }
    },
    selectImportedProject: (selected: string) => state => {
      return {
        importProjectModal: {
          search: state.importProjectModal.search,
          selected
        }
      }
    },
    closeImportProjectModal: () => state => {
      return { importProjectModal: null }
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
    // ## Shortcut modal
    openShortcutsModal: () => ({ shortcutsModal: true }),
    closeShortcutsModal: () => ({ shortcutsModal: false }),
    // ## Create file modal
    createFileModal: createFileForm.actions,
    openCreateFileModal: (path: string) => {
      logEvent("screen_view", { screen_name: "Create file" })
      const value = path === ROOT_PATH ? ROOT_PATH : path + "/"
      return {
        createFileModal: {
          path: { value, original: value }
        }
      }
    },
    closeCreateFileModal: () => {
      return { createFileModal: null }
    },
    // ## Delete file modal
    openDeleteFileModal: (deleteFileModal: string) => {
      logEvent("screen_view", { screen_name: "Delete file" })
      return { deleteFileModal }
    },
    closeDeleteFileModal: () => state => {
      return { deleteFileModal: null }
    },
    // ## Embed modal
    openEmbedModal: () => {
      logEvent("screen_view", { screen_name: "Embed modal" })
      return { embedModal: true }
    },
    closeEmbedModal: () => {
      return { embedModal: null }
    }
  }
}
