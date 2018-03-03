import { h } from "hyperapp"

import { Match, replace } from "lib/router"

import { State, Actions } from "api"
import { CreateProjectModal } from "./CreateProjectModal"

import "./ProjectEditorPage"

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

  actions.fetchProject({ id, open: true })

  const editor = state.editor
  if (editor.status !== "editing") {
    return (
      <div style={{ flex: "1 1 auto" }}>
        {CreateProjectModal({ state, actions })}
      </div>
    )
  }

  // TODO
  return <div>TODO add editor here.</div>
}
