import { h } from "hyperapp"

import { TabItem, Tab } from "lib/components"
import { getName, getParentName } from "lib/fs"

import { State, Actions } from "../api"
import { SourceEditor } from "./SourceEditor"
import { getSelectedFile, isDirty } from "../selectors"

import "./SourcesPane.scss"

function SourceName(path: string, name, duplicated: boolean) {
  if (duplicated) {
    const parent = getParentName(path)
    return [<small>{parent + "/"}</small>, name]
  }
  return name
}

export interface SourcesPaneProps {
  state: State
  actions: Actions
}

export function SourcesPane(props: SourcesPaneProps) {
  const { state, actions } = props

  const names: { [name: string]: number } = {}

  state.openedSources.forEach(path => {
    const name = state.fileTree[path].name
    names[name] = (names[name] || 0) + 1
  })

  const selected = getSelectedFile(state)

  const tabItems = state.openedSources.map(path => {
    const onClick = (e: Event) => {
      e.preventDefault()
      actions.selectFile(path)
    }

    const onClose = (e: Event) => {
      e.stopPropagation()
      actions.closeFile(path)
    }

    const node = state.fileTree[path]
    return (
      <TabItem active={path === selected.path}>
        <a href="#" onclick={onClick}>
          {SourceName(path, node.name, names[node.name] > 1)}
          {isDirty(state, path) ? " *" : ""}
          <button class="btn btn-clear" onclick={onClose} />
        </a>
      </TabItem>
    )
  })

  return (
    <div class="sources-pane">
      <div class="tabs-wrapper">
        <Tab>{tabItems}</Tab>
      </div>
      {selected
        ? SourceEditor({ state, actions, source: selected.path })
        : "No source selected"}
    </div>
  )
}
