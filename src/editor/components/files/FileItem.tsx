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
  file: SourceNode
}

const FileDropdown = (props: FileDropdownProps) => {
  return (
    <div class="dropdown dropdown-right float-right" onclick={stopPropagation}>
      <a href="#" class="dropdown-toggle">
        <Icon name="bars" class="actions float-right" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={() => props.actions.ui.openDeleteFileModal(props.file)}
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
  file: SourceNode
  onSelectFile(file: string): void
}

function getFileSuffix(state: State, file: SourceNode): string {
  if (isEditable(state) && isDirty(file)) {
    return "*"
  }
  return ""
}

export const FileItem = (props: FileItemProps) => {
  const { state, actions, file, onSelectFile } = props
  const onselect = e => {
    onSelectFile(file.id)
  }

  const onpreview = (e: Event) => {
    e.stopPropagation()
    actions.files.preview(file)
  }

  return (
    <div class="file c-hand" onclick={onselect}>
      <i class="fa fa-file-text-o" aria-hidden="true" />
      <span>{" " + file.name + getFileSuffix(state, file)}</span>{" "}
      <span
        class="tooltip tooltip-bottom"
        data-tooltip="View a read-only version of the file.\nUseful to copy/paste code in your project."
      >
        <i class="fa fa-eye preview" aria-label="Preview" onclick={onpreview} />
      </span>
      {FileDropdown(props)}
    </div>
  )
}
