import { h } from "hyperapp"

import { FileNode } from "projects/fileTree"

export interface DeleteFileModalProps {
  deleting?: FileNode
  close(): void
  confirm(file: FileNode): void
}

export const DeleteFileModal = (props: DeleteFileModalProps) => {
  const { deleting, close, confirm } = props

  const ondelete = () => {
    confirm(deleting)
    close()
  }

  return (
    <div class={"modal modal-sm" + (deleting ? " active" : "")}>
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
            to delete {deleting ? deleting.name : "this file"}:
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
