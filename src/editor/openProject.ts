import * as api from "./api"
import { Project, Files, NEW_PROJECT_ID } from "projects"

import { configureFor } from "./monaco"
import { State } from "./api"

import { debug } from "./debug/module"
import { ui } from "./ui/module"
import { getFileTree } from "./getFileTree"
import { getState as getPanesState } from "./panes/module"

function getStatus(project: Project, actions: api.InternalActions): api.Status {
  const details = project.details
  if (details.id === NEW_PROJECT_ID) {
    return "local-only"
  }
  const user = actions._users.getState().user
  if (user && user.id === details.owner.id) {
    return "editing"
  }

  return "read-only"
}

export function openProject(
  state: api.State,
  actions: api.InternalActions,
  project: Project
): Partial<State> {
  if (state.project && state.project.details.id !== project.details.id) {
    actions.close()
  }

  configureFor(project.files, true)

  const mainPath = project.details.mainPath
  const index = project.files[mainPath]

  const result: State = {
    ...state,
    original: project,
    project,
    status: getStatus(project, actions),
    expandedFolders: { "/": true, "/dependencies": true },
    panes: getPanesState(project),
    ui: {}
  }

  result.fileTree = getFileTree(result)

  return result
}
