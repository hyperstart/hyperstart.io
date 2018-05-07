import { h } from "hyperapp"

import { LogFn } from "logger"

import * as projects from "projects"

import { State, Actions, FileNode } from "../../api"
import { isDirty, isNew } from "../../selectors"
import { Action } from "./Action"

export interface FileItemProps {
  state: State
  actions: Actions
  log: LogFn
  item: string
}

function getFileSuffix(state: State, file: FileNode): string {
  if (isNew(state, file.path)) {
    return " *"
  }
  if (isDirty(state, file.path)) {
    return " *"
  }
  return ""
}

function FileActions(props: FileItemProps) {
  const { state, actions, item } = props

  if (item === state.project.details.mainPath) {
    return <span class="main-file">main file</span>
  }

  return (
    <span class="actions actions__files">
      {/* <Action icon="far fa-edit" onclick={() => {}} tooltip="Rename or Move" /> */}
      <Action
        icon="fas fa-times"
        onclick={() => actions.ui.openDeleteFileModal(item)}
        tooltip="Delete"
      />
    </span>
  )
}

export function FileItem(props: FileItemProps) {
  const { state, actions, item } = props
  const node = state.fileTree[item]

  function onselect(e: Event) {
    e.stopImmediatePropagation()
    actions.openFiles({
      sources: item
    })
  }

  return (
    <div class="file c-hand" onclick={onselect}>
      <span>
        <i class="far fa-file-alt" aria-hidden="true" />
        <span>{" " + node.name + getFileSuffix(state, node)}</span>{" "}
        <span class="actions">
          <Action
            icon="fas fa-eye"
            onclick={() => actions.previewFile(node)}
            tooltip="Preview File"
            tooltip-side="right"
          />
        </span>
      </span>
      {FileActions(props)}
    </div>
  )
}
