import { h } from "hyperapp"

import { Icon } from "lib/components"
import { FolderNode } from "projects/fileTree"
import { DEPENDENCIES_FOLDER } from "projects/constants"

import { State, Actions } from "../../api"

function stopPropagation(e: Event) {
  e.stopPropagation()
}

interface FolderActionsProps {
  state: State
  actions: Actions
  item: FolderNode
}

const FolderDropdown = (props: FolderActionsProps) => {
  const actions = props.actions.ui
  return (
    <div class="dropdown dropdown-right float-right" onclick={stopPropagation}>
      <a href="#" class="dropdown-toggle">
        <Icon name="bars" class="actions float-right" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={() =>
              actions.openCreateFileModal({ type: "file", parent: props.item })
            }
          >
            New File
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#"
            onclick={() =>
              actions.openCreateFileModal({
                type: "folder",
                parent: props.item
              })
            }
          >
            New Folder
          </a>
        </li>
        <li class="divider" />
        <li class="menu-item">
          <a href="#" onclick={() => actions.openDeleteFileModal(props.item)}>
            Delete
          </a>
        </li>
      </ul>
    </div>
  )
}

function FolderActions(props: FolderActionsProps) {
  const { state, item } = props
  if (!state.project) {
    return
  }

  const actions = []

  if (item.path !== DEPENDENCIES_FOLDER) {
    actions.push(
      <a
        href="#"
        onclick={() =>
          props.actions.ui.openCreateFileModal({
            parent: props.item,
            type: "file"
          })
        }
        class="actions"
      >
        <Icon name="file-text-o" class="fa-fw" />
      </a>,
      <a
        href="#"
        onclick={() =>
          props.actions.ui.openCreateFileModal({
            parent: props.item,
            type: "folder"
          })
        }
        class="actions"
      >
        <Icon name="folder-open-o" class="fa-fw" />
      </a>,
      // <a href="#" onclick={() => {}} class="actions">
      //   <Icon name="edit" />
      // </a>,
      <a
        href="#"
        onclick={() => props.actions.ui.openDeleteFileModal(props.item)}
        class="actions"
      >
        <Icon name="trash" class="fa-fw" />
      </a>
    )
  } else {
    actions.push(
      <a
        href="#"
        onclick={() => props.actions.ui.openImportProjectDialog()}
        class="actions"
      >
        <Icon name="plus" class="fa-fw" />
      </a>
    )
  }

  return <div class="float-right">{actions}</div>
}

// ## Folder

export interface FolderItemProps {
  state: State
  actions: Actions
  item: FolderNode
}

export const FolderItem = (props: FolderItemProps) => {
  const { state, actions, item } = props

  const Tooltip =
    item.name === DEPENDENCIES_FOLDER && !item.parent ? (
      <span
        class="tooltip tooltip-bottom"
        data-tooltip={`This folder contains all the projects that \nhave been imported (via File's dropdown \nmenu). All projects in this folder can be \nimported from inside your sources.`}
      >
        <i class="fa fa-question-circle-o preview" aria-hidden="true" />
      </span>
    ) : null
  return (
    <div class="file c-hand">
      <Icon name={item.expanded ? "folder-open-o" : "folder-o"} /> {item.name}{" "}
      {Tooltip}
      {FolderActions(props)}
    </div>
  )
}

