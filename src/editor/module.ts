import { ModuleImpl } from "lib/modules"

import * as projects from "projects"
import { createProjects } from "projects/module"
import * as global from "api"
import * as users from "users"

import { debug } from "./debug/module"
import { sources } from "./sources/module"
import { ui } from "./ui/module"

import * as api from "./api"
import { openProject } from "./openProject"

// TODO
const localStore = createProjects(null)

let userActions: users.Actions

export const editor: ModuleImpl<api.State, api.Actions> = {
  // # State
  state: {
    // ## Sub-module
    debug: debug.state,
    localStore: localStore.state,
    sources: sources.state,
    ui: ui.state,
    // ## State
    files: { byId: {}, byPath: {}, roots: [] },
    status: "closed"
  },
  // # Actions
  actions: {
    // ## Sub-module
    debug: debug.actions,
    localStore: localStore.actions,
    sources: sources.actions,
    ui: ui.actions,
    // ## Wiring
    init: (actions: global.Actions) => {
      userActions = actions.users
    },
    getState: () => state => state,
    // ## Project
    open: (project: projects.Project) => (state, actions) => {
      const user = userActions.getState().currentUser
      openProject(state, actions, project, user ? user.id : null)
    },
    close: () => {
      return {
        compilationOutput: null,
        debug: debug.state,
        files: null,
        project: null,
        sources: sources.state,
        status: "closed",
        ui: ui.state
      }
    },
    submitEdits: () => (state, actions): Promise<void> => {
      // TODO
      return null
    },
    setOwner: (owner: projects.Owner) => (state, actions): Promise<void> => {
      // TODO
      return null
    },
    saveAllSources: () => (state, actions): Promise<void> => {
      // TODO
      return null
    },
    run: (debug: boolean) => (state, actions): Promise<void> => {
      // TODO
      return null
    },
    importProjects: (projects: string[]): Promise<void> => {
      // TODO
      return null
    },
    // ## Files
    toggleFileExpanded: (path: string) => (state, actions) => {
      // TODO
    },
    createFile: (file: api.CreateFilePayload) => (
      state,
      actions
    ): Promise<void> => {
      // TODO
      return null
    },
    deleteFile: (file: string | projects.File) => (
      state,
      actions
    ): Promise<void> => {
      // TODO
      return null
    },
    previewFile: (file: string | projects.File) => (state, actions) => {
      // TODO
    },
    setFileContent: (source: api.SetFileContentPayload) => (state, actions) => {
      // TODO
    }
  }
}
