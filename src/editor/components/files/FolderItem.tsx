import { h } from "hyperapp"

import { Icon } from "lib/components"

import { LogFn } from "logger"
import * as projects from "projects"

import { State, Actions, FileNode } from "../../api"

import "./FolderItem.scss"
import { getPackageJsonInFolder } from "../../selectors"

export interface FolderItemProps {
  state: State
  actions: Actions
  log: LogFn
  item: string
}

function FolderVersion(props: FolderItemProps) {
  const { state, item } = props
  const pkgJson = getPackageJsonInFolder(state, item)
  if (pkgJson) {
    return <span class="folder-version">@{pkgJson.version}</span>
  }
  return null
}

function FolderActions(props: FolderItemProps) {
  const { state, actions, item } = props

  // if (path === projects.ROOT_PATH) {

  // }
  // if (path === projects.DEPENDENCIES_FOLDER_PATH) {

  // }

  return null // TODO
}

function FolderName(props: FolderItemProps) {
  const { state, item } = props
  const node = state.fileTree[item]
  return node.name
}

export function FolderItem(props: FolderItemProps) {
  const { state, item } = props
  const node = state.fileTree[item]

  return (
    <div class="file c-hand">
      <Icon name={node.expanded ? "folder-open" : "folder"} />{" "}
      {FolderName(props)}
      {FolderVersion(props)} {FolderActions(props)}
    </div>
  )
}
