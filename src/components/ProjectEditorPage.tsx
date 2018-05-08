import { h } from "hyperapp"

import { Match, replace } from "lib/router"

import { State, Actions } from "api"
import { Editor } from "editor/Editor"
import { CreateProjectModal } from "./CreateProjectModal"

import { LogFn } from "logger"
import { isLoading } from "selectors"

export interface ProjectEditorPageProps {
  state: State
  actions: Actions
  match: Match
}

export function ProjectEditorPage(props: ProjectEditorPageProps) {
  const { state, actions, match } = props
  const id = match.params.id
  if (!id) {
    replace("/")
    return <div style={{ flex: "1 1 auto" }} />
  }

  const editor = state.editor
  if (!editor.project) {
    return <div style={{ flex: "1 1 auto" }}> </div>
  }

  const loading = isLoading(state)
  return Editor({
    state: state.editor,
    actions: actions.editor,
    log: actions.logger.log,
    loading
  })
}
