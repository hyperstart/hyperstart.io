import * as router from "lib/router"

import * as bundles from "bundles/api"
import * as editor from "editor/api"
import * as logger from "logger/api"
import * as projects from "projects/api"
import * as search from "lib/search/api"
import * as ui from "ui"
import * as users from "users"

// # State

export interface State {
  bundles: bundles.State
  editor: editor.State
  logger: logger.State
  projects: projects.State
  router: router.State
  search: search.State
  ui: ui.State
  users: users.State
}

// # Actions

export interface FetchProjectPayload {
  id: string
  open?: boolean
}

export interface Actions {
  bundles: bundles.Actions
  editor: editor.Actions
  logger: logger.Actions
  projects: projects.Actions
  router: router.Actions
  search: search.Actions
  ui: ui.Actions
  users: users.Actions
  init(): void
  createProject(): Promise<void> | null
  fetchProject(payload: FetchProjectPayload): Promise<projects.Project> | null
  getState(): State
}

export interface ModuleActions<State> {
  init(actions: Actions): void
  getState(): State
}
