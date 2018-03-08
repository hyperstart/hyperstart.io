import { h } from "hyperapp"

import { File } from "projects"
import { User } from "users"

import { State, Actions } from "../api"
import { ProjectDetailsSection } from "./ProjectDetailsSection"
import { ImportProjectModal } from "./ImportProjectModal"
import { ProjectFilesSection } from "./files"

export interface ArtifactTabProps {
  state: State
  actions: Actions
  currentUser: User | null
  style?: any
}

export const ArtifactTab = (props: ArtifactTabProps) => {
  const { state } = props
  const project = state.project
  if (!project || state.status === "loading" || state.status === "error") {
    return <div />
  }

  return (
    <div class="view-pane-tab artifact-tab">
      {ProjectDetailsSection(props)}
      {ProjectFilesSection(props)}
      {ImportProjectModal(props)}
    </div>
  )
}
