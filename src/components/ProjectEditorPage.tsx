import { h } from "hyperapp"

import { Match, replace } from "lib/router"

import { State, Actions } from "api"
import { Editor } from "editor/Editor"
import { CreateProjectModal } from "./CreateProjectModal"

import "./ProjectEditorPage"
import { LogFn } from "logger"
import { isLoading } from "selectors"

export interface ProjectEditorPageProps {
  state: State
  actions: Actions
  match: Match
  log: LogFn
}

export function ProjectEditorPage(props: ProjectEditorPageProps) {
  const { state, actions, log, match } = props
  const id = match.params.id
  if (!id) {
    replace("/")
    return <div style={{ flex: "1 1 auto" }} />
  }

  const editor = state.editor
  if (editor.status === "closed" || editor.status === "error") {
    return (
      <div style={{ flex: "1 1 auto" }}>
        {CreateProjectModal({ state, actions, log })}
      </div>
    )
  }

  const loading = isLoading(state)
  const currentUser = state.users.user
  return Editor({
    state: state.editor,
    actions: actions.editor,
    currentUser,
    log,
    loading
  })
}
