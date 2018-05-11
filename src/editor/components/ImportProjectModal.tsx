import { h } from "hyperapp"

import { TextField, SearchResults, Pagination } from "lib/search/components"

import { Project, ProjectDetails } from "projects/api"
import { ProjectTitle, ProjectOwner } from "projects/components"

import { State, Actions } from "../api"
import { LogFn } from "logger"

import "./ImportProjectModal.scss"

function ProjectTableRow(
  project: ProjectDetails,
  index: number,
  props: ImportProjectModalProps
) {
  const { state, actions } = props
  const onclick = () => {
    actions.ui.selectImportedProject(project.id)
  }
  return (
    <tr
      class={
        project.id === state.ui.importProjectModal.selected ? "active" : ""
      }
      onclick={onclick}
    >
      <ProjectTitle project={project} Tag="td" />
      <ProjectOwner project={project} Tag="td" />
    </tr>
  )
}

function ProjectTable(props, children) {
  return (
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Owner</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export interface ImportProjectModalProps {
  state: State
  actions: Actions
  log: LogFn
}

export const ImportProjectModal = (props: ImportProjectModalProps) => {
  const { state, actions, log } = props
  const modal = state.ui.importProjectModal
  if (!modal) {
    return <div />
  }

  const oncancel = e => {
    e.preventDefault()
    actions.ui.closeImportProjectModal()
  }

  const onsubmit = e => {
    const project = modal.selected
    if (project) {
      e.preventDefault()
      log(actions.importProject(project))
      actions.ui.closeImportProjectModal()
    }
  }

  const searchState = modal.search
  const searchActions = actions.ui.importProjectModal.search
  return (
    <div class="modal active import-project-modal">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeImportProjectModal}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeImportProjectModal}
          />
          <h3 class="modal-title">Add Dependency</h3>
          <TextField
            state={searchState}
            actions={searchActions}
            name="import-project"
            type="pane"
            log={log}
            placeholder="Search for a project..."
            displaySearchButton={true}
          />
        </div>
        <div class="modal-body">
          <SearchResults
            state={searchState}
            actions={searchActions}
            name="import-project"
            aroundResults={ProjectTable}
            resultView={ProjectTableRow}
            hideBottomPagination={true}
            hideTopPagination={true}
            singleResultViewProps={props}
            log={log}
          />
        </div>
        <div
          class="modal-footer"
          style={{ display: "flex", "justify-content": "space-between" }}
        >
          <Pagination
            state={searchState}
            actions={searchActions}
            name="import-project"
            log={log}
          />
          <div>
            <button class="btn btn-secondary" onclick={oncancel}>
              Cancel
            </button>
            <button
              class={"btn btn-primary" + (modal.selected ? "" : " disabled")}
              onclick={onsubmit}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
