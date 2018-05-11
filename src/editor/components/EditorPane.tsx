import { h } from "hyperapp"

import { Tab, TabItem } from "lib/components"
import { getParentName } from "lib/fs"

import { LogFn } from "logger"

import { State, Actions, FileNode } from "../api"
import { PROJECT_TAB_ID, OUTPUT_TAB_ID, PaneState } from "../panes"
import { isDirty, isSinglePane } from "../selectors"
import { ProjectTab } from "./ProjectTab"
import { OutputTab } from "./OutputTab"
import { SourceEditor } from "./SourceEditor"

import "./EditorPane.scss"

export type EditorPaneType = "sources" | "views"

// # Tabs

// ## getViewTab

function getViewTab(actions: Actions, tab: UiTab, selected: boolean) {
  const onClick = (e: Event) => {
    e.preventDefault()
    actions.panes.selectTab(tab.id)
  }
  return (
    <TabItem active={selected}>
      <a href="#" onclick={onClick}>
        {tab.name}
      </a>
    </TabItem>
  )
}

// ## getSourceTab

function getSourceTab(
  state: State,
  actions: Actions,
  tab: UiTab,
  selected: boolean
) {
  const path = tab.id
  const onClick = (e: Event) => {
    e.preventDefault()
    actions.panes.selectTab(path)
  }

  const onClose = (e: Event) => {
    e.stopPropagation()
    actions.panes.closeFiles(path)
  }

  const node = state.fileTree[path]
  return (
    <TabItem active={selected}>
      <a href="#" onclick={onClick}>
        {tab.prefix && <small>{tab.prefix}</small>}
        {tab.name}
        {isDirty(state, path) ? " *" : ""}
        <button class="btn btn-clear" onclick={onClose} />
      </a>
    </TabItem>
  )
}

// ## getTabs

interface UiTab {
  id: string
  name: string
  prefix?: string
}

interface UiTabs {
  tabs: JSX.Element[]
  selected: UiTab | null
}

function getTabs(state: State, actions: Actions, pane: PaneState): UiTabs {
  const names: { [name: string]: number } = {}

  pane.opened.forEach(path => {
    const node = state.fileTree[path]
    if (!node) {
      return
    }
    const name = node.name
    names[name] = (names[name] || 0) + 1
  })

  const selectedId = pane.selected.length === 0 ? null : pane.selected[0]
  let selected: UiTab = null

  const tabs = pane.opened.map(id => {
    let tab: UiTab
    let result: JSX.Element
    if (id === PROJECT_TAB_ID) {
      tab = { id, name: "Project" }
      result = getViewTab(actions, tab, id === selectedId)
    } else if (id === OUTPUT_TAB_ID) {
      tab = { id, name: "Output" }
      result = getViewTab(actions, tab, id === selectedId)
    } else {
      const file = state.fileTree[id]
      tab = {
        id,
        name: file.name,
        prefix: names[file.name] > 1 ? getParentName(id) : null
      }
      if (tab.prefix && !tab.prefix.endsWith("/")) {
        tab.prefix = tab.prefix + "/"
      }
      result = getSourceTab(state, actions, tab, id === selectedId)
    }

    if (id === selectedId) {
      selected = tab
    }
    return result
  })

  return { tabs, selected }
}

// # EditorPaneContent

interface EditorPaneContentProps extends EditorPaneProps {
  tab: UiTab | null
}

function EditorPaneContent(props: EditorPaneContentProps) {
  const { state, actions, tab } = props
  if (!tab) {
    return "No tab selected"
  }

  switch (tab.id) {
    case PROJECT_TAB_ID:
      return ProjectTab(props)
    case OUTPUT_TAB_ID:
      return OutputTab(props)
    default:
      return SourceEditor({ state, actions, source: tab.id })
  }
}

// // # DebuggerPane

// function Debugger(props: EditorPaneProps) {
//   const { state, type } = props
//   if (!state.debug.paneShown) {
//     return
//   }

//   if (type === "views" && !isSinglePane()) {
//     return
//   }

//   return DebuggerPane(props)
// }

// # EditorPane

export interface EditorPaneProps {
  state: State
  actions: Actions
  type: EditorPaneType
  log: LogFn
  loading: boolean
}

export function EditorPane(props: EditorPaneProps) {
  const { state, actions, type } = props

  // const debug = Debugger(props)
  // if (debug) {
  //   return debug
  // }

  const pane: PaneState = state.panes[type]
  const { tabs, selected } = getTabs(state, actions, pane)

  return (
    <div class="editor-pane">
      <Tab>{tabs}</Tab>
      <EditorPaneContent {...props} tab={selected} />
    </div>
  )
}
