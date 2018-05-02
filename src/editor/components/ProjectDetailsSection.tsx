import { h } from "hyperapp"

import { Disable, Button, Icon } from "lib/components"
import { normalize } from "lib/search"

import { User } from "users"
import { ProjectOwner, ProjectTitle } from "projects/components"
import { LogFn } from "logger"

import { State, Actions } from "../api"
import { isEditable } from "../selectors"

export interface ProjectDetailsSectionProps {
  state: State
  actions: Actions
  currentUser: User | null
  log: LogFn
  loading: boolean
}

function HeaderMenu(props: ProjectDetailsSectionProps) {
  const { state, actions, currentUser } = props
  if (!isEditable(state)) {
    return <div />
  }
  return (
    <div class="dropdown dropdown-right float-right">
      <a href="#" class="btn dropdown-toggle btn-secondary" tabindex="0">
        <Icon name="bars" class="actions float-right" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={e => {
              actions.ui.startEdit(state.project)
              e.preventDefault()
            }}
          >
            Edit
          </a>
        </li>
      </ul>
    </div>
  )
}

function ProjectEditableStatusAction(props: ProjectDetailsSectionProps) {
  const { state, actions, currentUser, log } = props
  if (currentUser) {
    const onclick = (e: Event) => {
      e.preventDefault()
      log(
        actions.setOwner({
          id: currentUser.id,
          displayName: currentUser.displayName
        })
      )
    }

    return (
      <span>
        <a href="#" onclick={onclick}>
          make a copy.
        </a>
      </span>
    )
  }

  return "please sign in."
}

function ProjectEditableStatusText(props: ProjectDetailsSectionProps) {
  const { state, currentUser } = props
  return isEditable(state) ? null : (
    <small>
      <i class="fas fa-exclamation-triangle" aria-hidden="true" /> Changes made
      to this project are not persisted, {ProjectEditableStatusAction(props)}
    </small>
  )
}

export function ProjectDetailsSection(props: ProjectDetailsSectionProps) {
  const { state, actions, log, loading } = props
  const project = state.project
  if (isEditable(state) && state.ui.editForm) {
    const formState = state.ui.editForm
    const formActions = actions.ui.editForm
    const value = formState["name"].value
    const error = formState["name"].error
    const oninput = e => {
      const name = e.target.value
      if (name !== value) {
        formActions.setField({ field: "name", value: name })
      }
    }
    const oncancel = e => {
      e.preventDefault()
      actions.ui.stopEdit()
    }
    const onsubmit = e => {
      e.preventDefault()
      log(actions.submitEdits())
    }

    let info = null
    if (value && !error) {
      let effectiveName = normalize(value)
      if (value !== effectiveName) {
        info = 'Will be saved as "' + effectiveName + '"'
      }
    }

    return (
      <div>
        <form onsubmit={onsubmit}>
          <div class="form-group">
            <Disable disabled={loading}>
              <input
                type="text"
                class={
                  "form-input " +
                  (error ? "is-error " : "") +
                  (info ? "is-success " : "") +
                  (loading ? "disabled" : "")
                }
                placeholder="Project Name"
                value={value}
                oninput={oninput}
              />
            </Disable>
            {error ? <p class="form-input-hint">{error}</p> : null}
            {info ? <p class="form-input-hint">{info}</p> : null}
          </div>
          <div class="form-group float-right">
            <Disable disabled={loading}>
              <input type="submit" class="btn btn-primary">
                Submit
              </input>
              <button class="btn btn-link" onclick={oncancel}>
                Cancel
              </button>
            </Disable>
          </div>
        </form>
        <ProjectOwner project={project} />
      </div>
    )
  }

  return (
    <div class="mx-2 project-details">
      <h1>
        <ProjectTitle project={project} />
        <HeaderMenu {...props} />
      </h1>
      {ProjectEditableStatusText(props)}
      <p>
        Made by: <ProjectOwner project={project} />
      </p>
    </div>
  )
}
