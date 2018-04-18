import { ActionsImpl, ModuleImpl } from "lib/modules"
import { get, merge, set } from "lib/immutable"
import { createForm, createFormState } from "lib/form/module"
import { createSearch } from "lib/search/module"
import { getVersions } from "lib/npm"

import * as projects from "projects"

import { PROJECT_TAB_ID } from "../constants"
import * as api from "./api"
import { debounce, getErrorMessage } from "lib/utils"

const editForm = createForm()
const createFileForm = createForm()
const search = createSearch([{ name: "import-project" }])

const fetchVersions = debounce(
  (pkg: string, actions: api.AddPackageDependencyActions) => {
    actions.set({ loading: true, error: null })
    getVersions(pkg)
      .then(versions => {
        actions.set({
          loading: false,
          error: null,
          versions
        })
      })
      .catch(e => {
        actions.set({
          loading: false,
          error: getErrorMessage(e),
          versions: []
        })
      })
  },
  200
)

const pkg: ActionsImpl<
  api.AddPackageDependencyState,
  api.AddPackageDependencyActions
> = {
  setInput: (input: string) => (_, actions) => {
    if (input !== "") {
      fetchVersions(input, actions)
    }
    return { input }
  },
  set: payload => payload
}

const addDependencyModal: ActionsImpl<
  api.AddDependencyModal,
  api.AddDependencyModalActions
> = {
  selectTab: (selectedTab: api.AddDependencyTab) => ({ selectedTab }),
  projectsSearch: search.actions,
  package: pkg
}

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
    hideShortcutsModal: () => ({ shortcutsModal: false }),
    // # Add Dependency modal
    addDependencyModal,
    openAddDependencyModal: () => ({
      addDependencyModal: {
        projectSearch: search.state,
        package: { input: "" },
        selectedTab: "package"
      }
    }),
    closeAddDependencyModal: () => ({ addDependencyModal: null })
  }
}
