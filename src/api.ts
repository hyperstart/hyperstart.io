import * as router from "lib/router"

import * as editor from "editor"
import * as logger from "logger"
import * as projects from "projects"
import * as users from "users"

// # State

export interface State {
  editor: editor.State
  logger: logger.State
  projects: projects.State
  router: router.State
  users: users.State
}

// # Actions

export interface Actions {
  editor: editor.Actions
  logger: logger.Actions
  projects: projects.Actions
  router: router.Actions
  users: users.Actions
  init(): void
}

export interface ModuleActions<State> {
  init(actions: Actions): void
  getState(): State
}
