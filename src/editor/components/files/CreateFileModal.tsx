import { h } from "hyperapp"

import { File } from "projects/api"

import { State, Actions } from "../../api"
import { getFileNode } from "../../selectors"
import { ModalForm } from "lib/form"
import { LogFn } from "logger"

export interface CreateFileModalProps {
  state: State
  actions: Actions
}

function getError(state: State): string | undefined {
  const modalState = state.ui.createFileModal
  const path = modalState.path.value as string

  if (path === "") {
    return "Please type a path for your file."
  }

  if (!path.startsWith("/")) {
    return 'Invalid path, should be of the form "/folder1/folder2/filename.ext".'
  }

  const node = getFileNode(state, path)

  return node && `A ${node.type} already exists with the given path.`
}

export const CreateFileModal = (props: CreateFileModalProps) => {
  const { state, actions } = props
  const modalState = state.ui.createFileModal
  const modalActions = actions.ui.createFileModal
  if (!modalState) {
    return <div />
  }

  const error = getError(state)

  return ModalForm({
    state: modalState,
    actions: modalActions,
    title: "Create File",
    fields: [{ type: "text", name: "path", placeholder: "File path", error }],
    canSubmit: () => !error,
    submit: () => actions.createFile(modalState.path.value),
    close: actions.ui.closeCreateFileModal
  })
}
