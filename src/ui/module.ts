import { ModuleImpl } from "lib/modules"

import { Template } from "projects"

import * as api from "./api"

export const ui: ModuleImpl<api.State, api.Actions> = {
  state: {
    // nothing
  },
  actions: {
    openCreateProject: () => ({
      createProject: { template: "hyperapp" }
    }),
    closeCreateProject: () => ({ createProject: null }),
    selectCreateProjectTemplate: (template: Template) => ({
      createProject: { template }
    })
  }
}
