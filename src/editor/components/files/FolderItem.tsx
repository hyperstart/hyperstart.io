import { h } from "hyperapp"

import { Icon } from "lib/components"

import { LogFn } from "logger"
import * as projects from "projects"

import { State, Actions, FileNode } from "../../api"
import { getPackageJsonInFolder } from "../../selectors"
import { Action } from "./Action"

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

  if (item === projects.ROOT_PATH) {
    return (
      <span class="actions actions__root">
        <Action
          icon="fas fa-plus"
          onclick={() => actions.ui.openCreateFileModal(item)}
          tooltip="Add File"
        />
      </span>
    )
  }
  if (item === projects.DEPENDENCIES_FOLDER_PATH) {
    return (
      <span class="actions actions__dependencies">
        <Action
          icon="fab fa-npm"
          onclick={actions.ui.openImportNpmPackageModal}
          tooltip="Add Npm package as Dependency"
        />
        <Action
          icon="fas fa-box-open"
          onclick={actions.ui.openImportProjectDialog}
          tooltip="Add Project as Dependency"
        />
      </span>
    )
  }
  const pkgJson = getPackageJsonInFolder(state, item)
  if (pkgJson) {
    if (pkgJson.hyperstart) {
      return (
        <span class="actions actions__dependencies">
          {/* <Action icon="fas fa-sync-alt" onclick={() => {}} tooltip="Update" /> Later */}
          <Action
            icon="fas fa-times"
            onclick={() => actions.ui.openDeleteFileModal(item)}
            tooltip="Delete"
          />
        </span>
      )
    }
    return (
      <span class="actions actions__dependencies">
        {/* <Action
          icon="far fa-edit"
          onclick={() => {}}
          tooltip="Change Version"
        /> */}
        <Action
          icon="fas fa-times"
          onclick={() => actions.ui.openDeleteFileModal(item)}
          tooltip="Delete"
        />
      </span>
    )
  }

  return (
    <span class="actions actions__folder">
      <Action
        icon="fas fa-plus"
        onclick={() => actions.ui.openCreateFileModal(item)}
        tooltip="Add File"
      />
      {/* <Action icon="far fa-edit" onclick={() => {}} tooltip="Rename or Move" /> */}
      <Action
        icon="fas fa-times"
        onclick={() => actions.ui.openDeleteFileModal(item)}
        tooltip="Delete"
      />
    </span>
  )
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
      <span>
        <Icon name={node.expanded ? "folder-open" : "folder"} />{" "}
        {FolderName(props)}
        {FolderVersion(props)}
      </span>
      {FolderActions(props)}
    </div>
  )
}
