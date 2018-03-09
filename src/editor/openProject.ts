import * as api from "./api"
import { Project, getFileTree } from "projects"

import { configureFor } from "./monaco"
import { PROJECT_TAB_ID } from "./constants"
import { State } from "./api"

import * as debug from "./debug"
import * as sources from "./sources"
import * as ui from "./ui"

const isEditable = (project: Project, currentUser: string): boolean =>
  project.details.owner && currentUser === project.details.owner.id

export function openProject(
  state: api.State,
  actions: api.Actions,
  project: Project,
  currentUser: string
): Partial<State> {
  if (state.project && state.project.id !== project.details.id) {
    actions.close()
  }

  const files = getFileTree(project.files)

  configureFor(files, true)
  const index = files.byPath[project.details.mainFile]
  const sources = {
    opened: [index],
    selected: [index]
  }
  const ui = {
    selectedViewPaneTab: PROJECT_TAB_ID
  }
  const debug: debug.State = {
    ...state.debug,
    runs: {},
    paneShown: false,
    selectedState: [],
    logs: []
  }
  return {
    compilationOutput: null,
    debug,
    files,
    project: project.details,
    sources,
    status: isEditable(project, currentUser) ? "editing" : "read-only",
    ui
  }
}
