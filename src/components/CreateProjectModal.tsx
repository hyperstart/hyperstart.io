import { h } from "hyperapp"

import { replace } from "lib/router"

import { State, Actions } from "../api"

import "./CreateProjectModal.scss"

export interface CreateProjectModalProps {
  state: State
  actions: Actions
}

export function CreateProjectModal(props: CreateProjectModalProps) {
  const { state, actions } = props

  const createProject = state.ui.createProject

  if (!createProject) {
    return <div />
  }

  const onsubmit = (e: Event) => {
    if (createProject.template) {
      e.preventDefault()
      actions.createProject()
    }
  }

  const selectBlank = (e: Event) => {
    e.preventDefault()
    actions.ui.selectCreateProjectTemplate("blank")
  }

  const selectHyperapp = (e: Event) => {
    e.preventDefault()
    actions.ui.selectCreateProjectTemplate("hyperapp")
  }

  const blankSelected = createProject.template === "blank"
  return (
    <div class="modal active create-project-modal">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeCreateProject}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeCreateProject}
          />
          <h3 class="modal-title">Please select a template</h3>
        </div>
        <div class="modal-body">
          <div style={{ display: "flex" }}>
            <div
              class={"card" + (blankSelected ? " active" : "")}
              onclick={selectBlank}
            >
              <div class="card-header">
                <h5 class="card-title">Blank</h5>
              </div>
              <div class="card-body">
                Selecting this template will create a minimal project that
                contains 3 files (css, html, and javascript) and is ready to
                run.
              </div>
            </div>
            <div
              class={"card" + (blankSelected ? "" : " active")}
              onclick={selectHyperapp}
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
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn" onclick={actions.ui.closeCreateProject}>
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
