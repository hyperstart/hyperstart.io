import { h } from "hyperapp"

import { File } from "projects/api"
import { FolderNode } from "projects/fileTree"

import { State, Actions } from "../../api"
import { fileExists } from "../../selectors"

export interface CreateFileModalProps {
  state: State
  actions: Actions
  confirm(type: "file" | "folder", name: string, parent?: File): void
}

export const CreateFileModal = (props: CreateFileModalProps) => {
  const { confirm, state, actions } = props
  const modalState = state.ui.createFileModal
  const modalActions = actions.ui.createFileModal
  if (!modalState) {
    return <div />
  }
  const parent = modalState.fields["parent"]
  const name = modalState.fields["name"]
  const type = modalState.fields["type"]
  const oninput = e => {
    const value = e.target.value
    if (name.value !== value) {
      modalActions.setField({ field: "name", value })
    }
  }
  const oncancel = e => {
    e.preventDefault()
    actions.ui.closeCreateFileModal()
  }
  const onsubmit = e => {
    e.preventDefault()
    let error = null
    if (!name.value) {
      error = "Name cannot be empty."
    } else if (fileExists(state, name.value, parent.value)) {
      error = "A file with this name already exists."
    }

    if (error) {
      modalActions.setField({ field: "name", error })
    } else {
      confirm(type.value, name.value, parent.value)
      actions.ui.closeCreateFileModal()
    }
  }

  return (
    <div class="modal modal-sm active">
      <a
        href="#"
        class="modal-overlay"
        aria-label="Close"
        onclick={actions.ui.closeCreateFileModal}
      />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={actions.ui.closeCreateFileModal}
          />
          <h3 class="modal-title">Enter a name</h3>
        </div>
        <div class="modal-body">
          <form onsubmit={onsubmit}>
            <div class="form-group">
              <label class="form-label" for="input-example-1">
                Name
              </label>
              <input
                type="text"
                id=""
                class={"form-input " + (name.error ? "is-error " : "")}
                placeholder={
                  type.value === "folder" ? "Folder name" : "File name"
                }
                value={name.value}
                oninput={oninput}
                oncreate={(e: HTMLElement) => e.focus()}
              />
              {name.error ? <p class="form-input-hint">{name.error}</p> : null}
            </div>
            <input type="submit" class="btn btn-primary float-right">
              Submit
            </input>
            <button class="btn float-right" onclick={oncancel}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
