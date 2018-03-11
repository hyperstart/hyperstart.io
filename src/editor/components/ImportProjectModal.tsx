import { h } from "hyperapp"

import { TextField, SearchResults, Pagination } from "lib/search/components"

import { Project, Details } from "projects/api"
import { ProjectTitle, ProjectOwner } from "projects/components"

import { State, Actions } from "../api"

function ProjectTableRow(
  project: Details,
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
        project.id === state.ui.importProjectDialog.selected ? "active" : ""
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
}

export const ImportProjectModal = (props: ImportProjectModalProps) => {
  const { state, actions } = props
  const dialog = state.ui.importProjectDialog
  if (!dialog) {
    return <div />
  }

  const oncancel = e => {
    e.preventDefault()
    actions.ui.closeImportProjectDialog()
  }

  const onsubmit = e => {
    const project = dialog.selected
    if (project) {
      e.preventDefault()
      actions.importProjects([project])
      actions.ui.closeImportProjectDialog()
    }
  }

  const searchState = dialog.search
  const searchActions = actions.ui.importProjectDialog.search
  return (
    <div class="modal active import-project-modal">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeImportProjectDialog}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeImportProjectDialog}
          />
          <h3 class="modal-title">Please select a project</h3>
          <TextField
            state={searchState}
            actions={searchActions}
            name="import-project"
            type="pane"
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
          />
          <div>
            <button class="btn" onclick={oncancel}>
              Cancel
            </button>
            <button
              class={"btn btn-primary" + (dialog.selected ? "" : " disabled")}
              onclick={onsubmit}
            >
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
