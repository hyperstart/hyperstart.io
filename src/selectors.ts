import { State } from "./api"
import { Project } from "projects"
import { getFiles } from "editor/selectors"

export function isLoading(state: State): boolean {
  return state.logger.current && state.logger.current.severity === "loading"
}

export function getEditedProject(
  state: State,
  includeEdits?: boolean
): Project | null {
  if (!state.editor.project) {
    return null
  }

  const id = state.editor.project.id
  const store = state.users.user ? state.projects : state.editor.localStore

  if (!includeEdits) {
    return store[id]
  }

  return {
    details: store[id].details,
    status: store[id].status,
    files: getFiles(state.editor)
  }
}
