import { location } from "@hyperapp/router"

import { ModuleImpl } from "lib/modules"

import { State, Actions } from "./api"
import { editor } from "./editor"
import { logger } from "./logger"
import { projects } from "./projects"
import { users } from "./users"

export const app: ModuleImpl<State, Actions> = {
  state: {
    editor: editor.state,
    location: location.state,
    logger: logger.state,
    projects: projects.state,
    users: users.state
  },
  actions: {
    editor: editor.actions,
    location: location.actions,
    logger: logger.actions,
    projects: projects.actions,
    users: users.actions,

    init: () => (_, actions) => {
      // TODO
      // actions.editor.init(actions)
      // actions.logger.init(actions)
      // actions.projects.init(actions)
      // actions.users.init(actions)
    }
  }
}
