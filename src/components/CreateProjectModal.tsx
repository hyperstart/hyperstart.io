import { h } from "hyperapp"

import { replace } from "lib/router"
import { LogFn } from "logger"

import { State, Actions } from "../api"

import "./CreateProjectModal.scss"

export interface CreateProjectModalProps {
  state: State
  actions: Actions
}

export interface TemplateCardProps {
  selected: boolean
  select: (e: Event) => void
}

export function BlankTemplateCard(props: TemplateCardProps) {
  return (
    <div
      class={"card" + (props.selected ? " active" : "")}
      onclick={props.select}
    >
      <div class="card-header text-center">
        <i class="fas fa-box-open fa-2x" id="blank" />
        <h5 class="card-title">Blank</h5>
      </div>
      <div class="card-body text-center">
        <p>
          Selecting this template will create a minimal project with JS, CSS and
          HTML.
        </p>
      </div>
    </div>
  )
}

export function HyperappTemplateCard(props: TemplateCardProps) {
  return (
    <div
      class={"card" + (props.selected ? " active" : "")}
      onclick={props.select}
    >
      <div class="card-header text-center">
        <img src="/hyperapp_logo.png" width="32" id="hyperapp" />
        <h5 class="card-title">Hyperapp</h5>
      </div>
      <div class="card-body text-center">
        <p>
          Selecting this template will create a project pre-configured for
          Hyperapp.
        </p>
      </div>
    </div>
  )
}

export function CreateProjectModal(props: CreateProjectModalProps) {
  const { state, actions } = props
  const log = actions.logger.log

  const createProject = state.ui.createProjectModal

  if (!createProject) {
    return <div />
  }

  const onsubmit = (e: Event) => {
    if (createProject.template) {
      e.preventDefault()
      log(actions.createProject())
    }
  }

  const selectBlank = (e: Event) => {
    e.preventDefault()
    actions.ui.selectCreateProjectModalTemplate("blank")
  }

  const selectHyperapp = (e: Event) => {
    e.preventDefault()
    actions.ui.selectCreateProjectModalTemplate("hyperapp")
  }

  const blankSelected = createProject.template === "blank"
  return (
    <div class="modal active create-project-modal">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeCreateProjectModal}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeCreateProjectModal}
          />
          <h3 class="modal-title">Please select a template</h3>
        </div>
        <div class="modal-body">
          <div style={{ display: "flex" }}>
            <BlankTemplateCard selected={blankSelected} select={selectBlank} />
            <HyperappTemplateCard
              selected={!blankSelected}
              select={selectHyperapp}
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-secondary"
            onclick={actions.ui.closeCreateProjectModal}
          >
            Cancel
          </button>{" "}
          <button
            class={
              "btn btn-primary" + (createProject.template ? "" : " disabled")
            }
            onclick={onsubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
