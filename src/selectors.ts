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

  return {
    details: state.editor.project,
    status: {},
    files: getFiles(state.editor)
  }
}
