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
      <div class="card-header">
        <h5 class="card-title">Blank</h5>
      </div>
      <div class="card-body">
        Selecting this template will create a minimal project that contains 3
        files (css, html, and javascript) and is ready to run.
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
      <div class="card-header">
        <h5 class="card-title">Hyperapp</h5>
      </div>
      <div class="card-body">
        Selecting this template will create a project pre-configured for{" "}
        <a
          href="https://github.com/hyperapp/hyperapp"
          target="_blank"
          onclick={(e: Event) => {
            e.stopPropagation()
          }}
        >
          Hyperapp
        </a>.
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
          <button class="btn" onclick={actions.ui.closeCreateProjectModal}>
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
