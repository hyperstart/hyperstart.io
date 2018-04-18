import { h } from "hyperapp"

import { Button } from "lib/components"

import { State, Actions } from "../../api"

export interface HeaderMenuProps {
  state: State
  actions: Actions
}

export function HeaderMenu(props: HeaderMenuProps) {
  const actions = props.actions.ui
  return (
    <div class="dropdown dropdown-right float-right">
      <Button icon="bars" class="dropdown-toggle" />
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={() => actions.openCreateFileModal({ type: "file" })}
          >
            New File
          </a>
        </li>
        <li class="menu-item">
          <a
            href="#"
            onclick={() => actions.openCreateFileModal({ type: "folder" })}
          >
            New Folder
          </a>
        </li>
        <li class="divider" />
        <li class="menu-item">
          <a href="#" onclick={actions.openAddDependencyModal}>
            Add Dependency
          </a>
        </li>
      </ul>
    </div>
  )
}
