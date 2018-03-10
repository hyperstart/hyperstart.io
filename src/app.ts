import { create as createRouter, replace } from "lib/router"
import { ModuleImpl } from "lib/modules"

import { State, Actions, FetchProjectPayload } from "./api"
import { isLoading } from "./selectors"
import { editor } from "editor/module"
import { logger } from "logger/module"
import { createProjects } from "projects/module"
import { createSearch } from "lib/search/module"
import { ui } from "ui/module"
import { users } from "users/module"

const router = createRouter()
// TODO
const projects = createProjects(null)
const search = createSearch(null, [])

export const app: ModuleImpl<State, Actions> = {
  state: {
    editor: editor.state,
    logger: logger.state,
    projects: projects.state,
    router: router.state,
    search: search.state,
    ui: ui.state,
    users: users.state
  },
  actions: {
    editor: editor.actions,
    logger: logger.actions,
    projects: projects.actions,
    router: router.actions,
    search: search.actions,
    ui: ui.actions,
    users: users.actions,

    init: () => (_, actions) => {
      actions.router.init()
      actions.logger.init(actions)
      actions.users.init(actions)
      actions.projects.init(actions)
      actions.editor.init(actions)
    },
    createProject: () => (state, actions) => {
      const template = state.ui.createProject
        ? state.ui.createProject.template
        : null
      if (!template) {
        return null
      }
      actions.ui.closeCreateProject()
      return actions.projects.createAndSave(template).then(project => {
        actions.editor.open(project)
        replace("/projects/" + project.details.id)
      })
    },
    fetchProject: (payload: FetchProjectPayload) => (state, actions) => {
      if (isLoading(state)) {
        return null
      }
      if (state.editor.status === "loading") {
        return null
      }
      if (
        state.editor.status === "editing" &&
        state.editor.project.id === payload.id
      ) {
        return null
      }

      return actions.projects.fetch(payload.id).then(project => {
        if (payload.open) {
          actions.editor.open(project)
        }

        return project
      })
    }
  }
}
