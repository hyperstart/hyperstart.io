import { create as createRouter, replace } from "lib/router"
import { ModuleImpl } from "lib/modules"

import { State, Actions, FetchProjectPayload } from "./api"
import { isLoading } from "./selectors"
import { editor } from "editor"
import { logger } from "logger"
import { projects } from "projects"
import { search } from "search"
import { ui } from "ui"
import { users } from "users"

const router = createRouter()

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
      // TODO
      // actions.editor.init(actions)
      // actions.logger.init(actions)
      // actions.projects.init(actions)
      actions.router.init()
      // actions.users.init(actions)
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
