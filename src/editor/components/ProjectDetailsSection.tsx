import { h } from "hyperapp"

import { Disable, Button, Icon } from "lib/components"
import { normalize } from "lib/search"

import { User } from "users"
import { LogFn } from "logger"

import { State, Actions } from "../api"
import { FormField, SetFieldPayload } from "lib/form"
import { FormFieldUpdate } from "lib/forms"

import "./ProjectDetailsSection.scss"

export interface ProjectDetailsSectionProps {
  state: State
  actions: Actions
  log: LogFn
  loading: boolean
}

function ProjectName(props: ProjectDetailsSectionProps) {
  const { state, actions, log, loading } = props
  const details = state.project.details
  const owner = details.owner
  const ownerName =
    owner && !owner.anonymous ? owner.displayName : "Anonymous User"

  const name = details.name
  const normalized = normalize(name)
  const info = name !== normalized ? `Will be saved as ${normalized}` : null

  function setField(payload: SetFieldPayload) {
    actions.setProjectName(payload.value)
  }

  return FormField({
    type: "text",
    state: { value: name, info },
    setField,
    disabled: loading,
    placeholder: "Untitled project",
    class: "project-name"
  })
}

function ProjectOwner(props: ProjectDetailsSectionProps) {
  const owner = props.state.project.details.owner
  const ownerName =
    owner && !owner.anonymous ? owner.displayName : "Anonymous User"

  return (
    <span class="project-owner">
      <small>A project by: </small> {ownerName}
    </span>
  )
}

export function ProjectDetailsSection(props: ProjectDetailsSectionProps) {
  const { state, actions, log, loading } = props
  const project = state.project
  return (
    <div class="mx-2 project-details">
      {ProjectName(props)}
      {ProjectOwner(props)}
    </div>
  )
}
