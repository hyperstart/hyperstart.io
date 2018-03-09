import { ModuleImpl } from "lib/modules"
import { get, merge, set } from "lib/immutable"
import { createForm } from "lib/form/module"
import { createSearch } from "lib/search/module"

import * as projects from "projects"

import { PROJECT_TAB_ID } from "../constants"
import * as api from "./api"

const editForm = createForm()
const createFileForm = createForm()
const search = createSearch()

export const ui: ModuleImpl<api.State, api.Actions> = {
  state: {
    selectedViewPaneTab: PROJECT_TAB_ID
  },
  actions: {
    // ## Edit form
    editForm: editForm.actions,
    startEdit: (project: projects.Details) => state => {
      // TODO
    },
    stopEdit: () => state => {
      // TODO
    },
    // ## Import project dialog
    importProjectDialog: {
      search: search.actions
    },
    openImportProjectDialog: () => state => {
      // TODO
    },
    selectImportedProject: (projectId: string) => state => {
      // TODO
    },
    closeImportProjectDialog: () => state => {
      // TODO
    },
    // ## Delete file modal
    openDeleteFileModal: (file: projects.FileNode) => state => {
      // TODO
    },
    closeDeleteFileModal: () => state => {
      // TODO
    },
    // ## Create file modal
    createFileDialog: createFileForm.actions,
    openCreateFileModal: (payload: api.OpenFileModalPayload) => state => {
      // TODO
    },
    closeCreateFileModal: () => state => {
      // TODO
    },
    // ## Selected file
    select: (fileId: string | null) => state => {
      // TODO
    },
    // ## Previewed file
    preview: (fileId: string | null) => state => {
      // TODO
    },
    // ## View pane's tabs
    selectViewPaneTab: (tab: string | null) => state => {
      // TODO
    }
  }
}
