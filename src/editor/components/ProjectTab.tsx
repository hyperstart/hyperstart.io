import { h } from "hyperapp"

import { File } from "projects"
import { User } from "users"

import { State, Actions } from "../api"
import { ProjectDetailsSection } from "./ProjectDetailsSection"
import { ImportNpmPackageModal } from "./ImportNpmPackageModal"
import { ImportProjectModal } from "./ImportProjectModal"
import { ProjectFilesSection, FilePreview } from "./files"
import { LogFn } from "logger"

import "./ProjectTab.scss"
import { getPreviewedFile } from "../selectors"

export interface ProjectTabProps {
  state: State
  actions: Actions
  currentUser: User | null
  log: LogFn
  loading: boolean
}

export const ProjectTab = (props: ProjectTabProps) => {
  const { state, actions } = props
  const project = state.project
  if (!project) {
    return <div />
  }

  const file = getPreviewedFile(state)
  if (file) {
    return (
      <div class="view-pane-tab project-tab">
        {FilePreview({ state, actions, file })}
      </div>
    )
  }

  return (
    <div class="view-pane-tab project-tab">
      {ProjectDetailsSection(props)}
      {ProjectFilesSection(props)}
      {ImportProjectModal(props)}
      {ImportNpmPackageModal(props)}
    </div>
  )
}
