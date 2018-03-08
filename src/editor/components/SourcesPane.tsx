import { h } from "hyperapp"

import { TabItem, Tab } from "lib/components"

import { FileNode, SourceNode } from "projects/fileTree"

import { State, Actions } from "../api"
import { getSelectedSource, isEditable } from "../selectors"
import { SourceEditor } from "./SourceEditor"

function SourceName(source: SourceNode, parent: FileNode, duplicated: boolean) {
  if (duplicated) {
    const parentName = parent ? parent.name : ""
    return [<small>{parentName + "/"}</small>, source.name]
  }
  return source.name
}

export interface SourcesPaneProps {
  state: State
  actions: Actions
}

export const SourcesPane = (props: SourcesPaneProps) => {
  const { state, actions } = props

  const names: { [name: string]: number } = {}

  state.sources.opened.forEach(id => {
    const source = state.files.byId[id]
    names[source.name] = (names[source.name] || 0) + 1
  })

  const selected = getSelectedSource(state)
  const hideDirty = !isEditable(state)

  const tabItems = state.sources.opened.map(id => {
    const source = state.files.byId[id] as SourceNode
    const parent = source.parent ? state.files.byId[source.parent] : null

    const onClick = (e: Event) => {
      e.preventDefault()
      actions.sources.select(id)
    }

    const onClose = (e: Event) => {
      // if (
      //   source.content !== source.original &&
      //   !confirm(
      //     source.name +
      //       " has unsaved changes, are you sure you want to close it?"
      //   )
      // ) {
      //   return
      // }
      e.stopPropagation()
      actions.sources.close(id)
    }

    return (
      <TabItem active={id === selected.id}>
        <a href="#" onclick={onClick}>
          {SourceName(source, parent, names[source.name] > 1)}
          {!hideDirty && source.original !== source.content ? " *" : ""}
          <button class="btn btn-clear" onclick={onClose} />
        </a>
      </TabItem>
    )
  })

  return (
    <div class="sources-pane">
      <Tab>{tabItems}</Tab>
      {selected
        ? SourceEditor({ state, actions, source: selected })
        : "No source selected"}
    </div>
  )
}
