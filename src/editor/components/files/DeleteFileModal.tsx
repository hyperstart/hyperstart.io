import { h } from "hyperapp"

import { State, Actions, FileNode } from "../../api"

export interface DeleteFileModalProps {
  state: State
  actions: Actions
}

export const DeleteFileModal = (props: DeleteFileModalProps) => {
  const { state, actions } = props

  const path = state.ui.deleteFileModal
  const node = path ? state.fileTree[path] : null

  const ondelete = () => {
    actions.deleteFile(node.path)
  }

  return (
    <div class={"modal modal-sm" + (node ? " active" : "")}>
      <a href="#" class="modal-overlay" aria-label="Close" onclick={close} />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={close}
          />
          <h3 class="modal-title">Are you sure?</h3>
        </div>
        <div class="modal-body">
          <p>
            This action is <em>irreversible</em>, please confirm that you wish
            to delete {node ? node.name : "this file"}:
          </p>
          <button
            class="btn float-right btn-error"
            onclick={ondelete}
            style={{ "margin-left": "0.4rem" }}
          >
            Delete
          </button>{" "}
          <button class="btn float-right btn-secondary" onclick={close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
