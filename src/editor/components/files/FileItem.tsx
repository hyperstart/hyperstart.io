import { h } from "hyperapp"

import { LogFn } from "logger"

import * as projects from "projects"

import { State, Actions, FileNode } from "../../api"
import { isDirty } from "../../selectors"

import "./FileItem.scss"

export interface FileItemProps {
  state: State
  actions: Actions
  log: LogFn
  item: string
}

function getFileSuffix(state: State, file: FileNode): string {
  if (isDirty(state, file.path)) {
    return "*"
  }
  return ""
}

function FileActions(FileItemProps) {
  // TODO
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
      <i class="far fa-file-alt" aria-hidden="true" />
      <span>{" " + node.name + getFileSuffix(state, node)}</span>{" "}
      {FileActions(props)}
    </div>
  )
}
