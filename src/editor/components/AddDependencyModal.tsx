import { h } from "hyperapp"

import { State, Actions } from "../api"
import { LogFn } from "../../logger"

import "./AddDependencyModal.scss"

// # Import Project Tab

// # Add Npm Package Tab

export interface AddDependencyModalProps {
  state: State
  actions: Actions
  log: LogFn
}

export function AddDependencyModal(props: AddDependencyModalProps) {
  const { state, actions, log } = props
  const modal = state.ui.addDependencyModal
  if (!modal) {
    return <div />
  }

  const oncancel = e => {
    e.preventDefault()
    actions.ui.closeAddDependencyModal()
  }

  const onsubmit = e => {
    e.preventDefault()
    if (modal.selectedTab === "project") {
      const project = modal.selectedProject
      if (project) {
        log(actions.importProjects([project]))
        actions.ui.closeImportProjectDialog()
      }
    } else {
      // TODO
    }
  }

  return (
    <div class="modal active add-dependency-modal">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeAddDependencyModal}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeAddDependencyModal}
          />
          <h3 class="modal-title">Add Dependency</h3>
        </div>
        <div class="modal-body">body</div>
        <div
          class="modal-footer"
          style={{ display: "flex", "justify-content": "space-between" }}
        >
          footer
          <div>
            <button class="btn btn-secondary" onclick={oncancel}>
              Cancel
            </button>
            <button class={"btn btn-primary"} onclick={onsubmit}>
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
