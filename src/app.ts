import { create as createRouter } from "lib/router"
import { ModuleImpl } from "lib/modules"

import { State, Actions } from "./api"
import { editor } from "editor"
import { logger } from "logger"
import { projects } from "projects"
import { search } from "search"
import { users } from "users"

const router = createRouter()

export const app: ModuleImpl<State, Actions> = {
  state: {
    editor: editor.state,
    logger: logger.state,
    projects: projects.state,
    router: router.state,
    search: search.state,
    users: users.state
  },
  actions: {
    editor: editor.actions,
    logger: logger.actions,
    projects: projects.actions,
    router: router.actions,
    search: search.actions,
    users: users.actions,

    init: () => (_, actions) => {
      actions.router.init()

      // TODO
      // actions.editor.init(actions)
      // actions.logger.init(actions)
      // actions.projects.init(actions)
      // actions.users.init(actions)
    }
  }
}
