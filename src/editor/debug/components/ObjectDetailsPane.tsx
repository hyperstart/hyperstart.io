import { h } from "hyperapp"

import "./ObjectDetailsPane.scss"

import { State, Actions, Run, AppAction } from "../api"
import { getSelectedAction } from "../selectors"

interface PaneProps {
  state: State
  actions: Actions
  action: AppAction
}

function Pane(content: string) {
  return (
    <div class="object-details-pane scrollable">
      <pre class="scrollable-content">{content}</pre>
    </div>
  )
}

function PaneData(props: PaneProps) {
  if (!props.action) {
    return Pane("")
  }
  return Pane(JSON.stringify(props.action.actionData, null, 2))
}

function PaneResult(props: PaneProps) {
  if (!props.action) {
    return Pane("")
  }
  return Pane(JSON.stringify(props.action.actionResult, null, 2))
}

function PaneState(props: PaneProps) {
  if (!props.action) {
    return Pane("")
  }
  return Pane(JSON.stringify(props.action.nextState, null, 2))
}

function PaneDebuggerState(props: PaneProps) {
  const { state } = props

  return Pane(JSON.stringify(props.state, null, 2))
}

export interface ObjectDetailsPaneProps {
  state: State
  actions: Actions
}

export function ObjectDetailsPane(props: ObjectDetailsPaneProps) {
  const { state, actions } = props
  const action = getSelectedAction(props.state)
  switch (props.state.valueDisplay) {
    case "data":
      return PaneData({ state, actions, action })
    case "result":
      return PaneResult({ state, actions, action })
    case "state":
      return PaneState({ state, actions, action })
    case "debugger-state":
      return PaneDebuggerState({ state, actions, action })
  }
}
