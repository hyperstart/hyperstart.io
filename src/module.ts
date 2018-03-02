import { ModuleImpl, combine } from "lib/modules"

import { State, Actions } from "./api"
import { editor } from "./editor"
import { logger } from "./logger"
import { projects } from "./projects"
import { users } from "./users"

export const module: ModuleImpl<State, Actions> = combine(
  {
    editor,
    logger,
    projects,
    users
  },
  {
    state: {},
    actions: {
      init: () => (_, actions) => {
        actions.editor.init(actions)
        actions.logger.init(actions)
        actions.projects.init(actions)
        actions.users.init(actions)
      }
    }
  }
)
