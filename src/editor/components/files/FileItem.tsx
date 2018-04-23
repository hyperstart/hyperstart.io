import { h } from "hyperapp"

import { SourceNode } from "projects/fileTree"
import { Icon } from "lib/components"

import { State, Actions } from "../../api"
import { isDirty, isEditable } from "../../selectors"

const stopPropagation = (e: Event) => {
  e.stopPropagation()
}

interface FileDropdownProps {
  state: State
  actions: Actions
  item: SourceNode
}

const FileDropdown = (props: FileDropdownProps) => {
  const { state, actions, item } = props
  if (item.path === state.project.mainFile) {
    return <span class="float-right main-file">main</span>
  }
  return (
    <div class="dropdown dropdown-right float-right" onclick={stopPropagation}>
      <a href="#" class="dropdown-toggle" tabindex="0">
        <Icon name="bars" class="actions float-right" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={() => props.actions.ui.openDeleteFileModal(props.item)}
          >
            Delete
          </a>
        </li>
      </ul>
    </div>
  )
}

// ## File

export interface FileItemProps {
  state: State
  actions: Actions
  item: SourceNode
}

function getFileSuffix(state: State, file: SourceNode): string {
  if (isEditable(state) && isDirty(file)) {
    return "*"
  }
  return ""
}

export const FileItem = (props: FileItemProps) => {
  const { state, actions, item } = props
  const onselect = e => {
    actions.sources.open({ sources: item.id })
  }

  const onpreview = (e: Event) => {
    e.stopPropagation()
    actions.previewFile(item)
  }

  return (
    <div class="file c-hand" onclick={onselect}>
      <i class="fa fa-file-text-o" aria-hidden="true" />
      <span>{" " + item.name + getFileSuffix(state, item)}</span>{" "}
      <span
        class="tooltip tooltip-bottom"
        data-tooltip={`View a read-only version of the file.
Useful to copy/paste code in your project.`}
      >
        <i class="fa fa-eye preview" aria-label="Preview" onclick={onpreview} />
      </span>
      {FileDropdown(props)}
    </div>
  )
}
