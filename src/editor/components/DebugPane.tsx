import { h } from "hyperapp"

import { Icon, Tree, SplitPane } from "lib/components"

import { AppAction, Run } from "../debug"
import { State, Actions, Diagnostic } from "../api"
import { DebuggerOptions, DebugPaneContent } from "../debug/components"
import { getRuns } from "../selectors"

interface PaneProps {
  state: State
  actions: Actions
  runs: Run[]
}

const Title = (actions: Actions) => {
  return (
    <div class="debug-title">
      <h4>Debugger</h4>
      <button
        class="btn btn-clear float-right"
        onclick={() => actions.debug.showPane(false)}
      />
    </div>
  )
}

export interface DebugPaneProps {
  state: State
  actions: Actions
}

export const DebugPane = (props: DebugPaneProps) => {
  const { state, actions } = props
  if (state.compilationOutput.loading) {
    return (
      <div class="debug-pane">
        {Title(actions)}
        <p>Loading...</p>
      </div>
    )
  }
  const runs = getRuns(state.debug.runs)
  if (runs.length === 0) {
    return (
      <div class="debug-pane">
        {Title(actions)}
        <p>No debug information found, please debug this project.</p>
      </div>
    )
  }
  return (
    <div class="debugger-pane">
      {Title(actions)}
      {DebuggerOptions({ state: state.debug, actions: actions.debug })}
      {DebugPaneContent({ state: state.debug, actions: actions.debug, runs })}
    </div>
  )
}
