import { ModuleImpl } from "lib/modules"

import { Template } from "projects"

import * as api from "./api"

export const ui: ModuleImpl<api.State, api.Actions> = {
  state: {
    createProjectTemplate: "hyperapp"
  },
  actions: {
    openCreateProjectModal: () => ({
      createProjectModal: { template: "hyperapp" }
    }),
    closeCreateProjectModal: () => ({ createProjectModal: null }),
    selectCreateProjectModalTemplate: (template: Template) => ({
      createProjectModal: { template }
    }),
    selectCreateProjectTemplate: (createProjectTemplate: Template) => ({
      createProjectTemplate
    })
  }
}
