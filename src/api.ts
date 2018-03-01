import { editor } from "editor"
import { logger } from "logger"
import { projects } from "projects"
import { users } from "users"

// # State

export interface State {
  editor: editor.State
  logger: logger.State
  projects: projects.State
  users: users.State
}

// # Actions

export interface Actions {
  editor: editor.Actions
  logger: logger.Actions
  projects: projects.Actions
  users: users.Actions
}

export interface ModuleActions {
  init(actions: Actions): void
}
