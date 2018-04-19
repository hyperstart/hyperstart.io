import * as api from "./api"
import { Project, getFileTree, FileTree } from "projects"

import { configureFor } from "./monaco"
import { PROJECT_TAB_ID } from "./constants"
import { State } from "./api"

import * as debug from "./debug"
import * as sources from "./sources"
import * as ui from "./ui"

const isEditable = (project: Project, currentUser: string): boolean =>
  project.details.owner && currentUser === project.details.owner.id

function getSources(files: FileTree, mainFile: string): sources.State {
  const index = files.byPath[mainFile]
  if (!mainFile || !index) {
    return {
      opened: [],
      selected: []
    }
  }

  return {
    opened: [index],
    selected: [index]
  }
}

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
  const sources = getSources(files, project.details.mainFile)

  const ui = {
    selectedViewPaneTab: PROJECT_TAB_ID
  }
  const debug: debug.State = {
    ...state.debug,
    runs: {},
    paneShown: false,
    selectedAction: null,
    logs: []
  }

  const editable = isEditable(project, currentUser)

  const result: Partial<State> = {
    compilationOutput: null,
    debug,
    files,
    project: project.details,
    sources,
    status: editable ? "editing" : "read-only",
    ui
  }

  if (!editable) {
    result.localStore = {
      ...state.localStore,
      [project.details.id]: project
    }
  }

  return result
}
