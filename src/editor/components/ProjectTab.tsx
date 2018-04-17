import { h } from "hyperapp"

import { File } from "projects"
import { User } from "users"

import { State, Actions } from "../api"
import { ProjectDetailsSection } from "./ProjectDetailsSection"
import { ImportProjectModal } from "./ImportProjectModal"
import { ProjectFilesSection } from "./files"
import { LogFn } from "logger"

import "./ProjectTab.scss"

export interface ProjectTabProps {
  state: State
  actions: Actions
  currentUser: User | null
  log: LogFn
  loading: boolean
}

export const ProjectTab = (props: ProjectTabProps) => {
  const { state } = props
  const project = state.project
  if (!project || state.status === "loading" || state.status === "error") {
    return <div />
  }

  return (
    <div class="view-pane-tab project-tab">
      {ProjectDetailsSection(props)}
      {ProjectFilesSection(props)}
      {ImportProjectModal(props)}
    </div>
  )
}
