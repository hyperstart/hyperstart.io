import { h } from "hyperapp"

import { File } from "projects"
import { User } from "users"

import { State, Actions } from "../api"
import { ProjectDetailsSection } from "./ProjectDetailsSection"
import { ImportNpmPackageModal } from "./ImportNpmPackageModal"
import { ImportProjectModal } from "./ImportProjectModal"
import { ProjectFilesSection } from "./files"
import { LogFn } from "logger"

import "./ProjectTab.scss"

export interface ProjectTabProps {
  state: State
  actions: Actions
  log: LogFn
  loading: boolean
}

export const ProjectTab = (props: ProjectTabProps) => {
  const { state, actions, log } = props
  const project = state.project
  if (!project) {
    return <div />
  }

  // TODO
  // const file = getPreviewedFile(state)
  // if (file) {
  //   return (
  //     <div class="view-pane-tab project-tab">
  //       {FilePreview({ state, actions, file })}
  //     </div>
  //   )
  // }

  return (
    <div class="view-pane-tab project-tab">
      {ProjectDetailsSection(props)}
      {ProjectFilesSection(props)}
      {ImportProjectModal(props)}
      {ImportNpmPackageModal(props)}
    </div>
  )
}
