import { h } from "hyperapp"

import { Icon, Tree, SplitPane } from "lib/components"

import { State, Actions, Diagnostic } from "../api"
import { AppAction, Run, AppState } from "../debug"
import { getRuns, getSelected, isSelected } from "../selectors"

interface StateItemProps {
  state: State
  actions: Actions
  run: Run
  action: AppAction
  actionId: number
  appState: AppState
  first: boolean
}

const StateItem = (props: StateItemProps) => {
  const { state, actions, run, action, actionId, appState, first } = props
  const selected = isSelected(state, appState)
  const select = () => {
    actions.debug.select(appState)
  }
  if (!appState.previousState) {
    const className = "state c-hand" + (selected ? " selected" : "")
    return (
      <li class={className} onclick={select}>
        {action.name}
      </li>
    )
  }

  if (first) {
    const collapsed = action.collapsed
    const toggle = () => {
      actions.debug.toggleAction({ run: run.id, actionId })
    }
    const hasIcon = action.states.length > 1
    const iconName = collapsed ? "caret-right" : "caret-down"
    const icon = hasIcon ? (
      <i
        class={`fa fa-${iconName} fa-fw`}
        aria-hidden="true"
        onclick={toggle}
      />
    ) : null
    const liClass =
      "state c-hand " +
      (hasIcon ? "has-icon" : "") +
      (selected ? " selected" : "")
    return (
      <li class={liClass} onclick={select}>
        {icon}
        {action.name}({JSON.stringify(appState.actionData)})
      </li>
    )
  }

  if (action.collapsed) {
    return null
  }

  const className = "state c-hand" + (selected ? " selected" : "")
  return (
    <li class={className} onclick={select}>
      {action.name}({JSON.stringify(appState.actionData)})
    </li>
  )
}

interface RunItemProps {
  state: State
  actions: Actions
  run: Run
  current: boolean
}

const RunItem = (props: RunItemProps) => {
  const { state, actions, run, current } = props
  const date = new Date(run.timestamp).toLocaleTimeString()
  const collapsed = run.collapsed
  const expandIcon = (
    <Icon name={collapsed ? "caret-right" : "caret-down"} class="fa-fw" />
  )

  const items = []
  if (!collapsed) {
    run.actions.forEach((action, actionId) => {
      const firstId = action.states.length - 1
      action.states.forEach((appState, stateId) => {
        items.unshift(
          StateItem({
            state,
            actions,
            run,
            action,
            actionId,
            appState,
            first: stateId === firstId
          })
        )
      })
    })
  }
  const onclick = () => {
    actions.debug.toggleRun(run.id)
  }

  let closeButton
  if (!current) {
    closeButton = (
      <button
        class="btn btn-clear float-right"
        onclick={() => actions.debug.deleteRun(run.id)}
      />
    )
  }

  return (
    <li>
      <div class="run" onclick={onclick}>
        {expandIcon} Debug - start time: {date}
        {closeButton}
      </div>
      {collapsed ? "" : <ul>{items}</ul>}
    </li>
  )
}

interface PaneProps {
  state: State
  actions: Actions
  runs: Run[]
}

const RunsPane = (props: PaneProps) => {
  const { state, actions, runs } = props
  const items = []
  const lastId = runs.length - 1
  runs.forEach((run, i) => {
    items.unshift(RunItem({ state, actions, run, current: i === lastId }))
  })
  return (
    <div class="runs-pane">
      <ul>{items}</ul>
    </div>
  )
}

const StatePane = (props: PaneProps) => {
  const { state, actions } = props
  const selected = getSelected(state)

  if (!selected) {
    return (
      <div class="state-pane">
        <p>No selected action.</p>
      </div>
    )
  }
  const full = state.debug.showFullState
  if (full || !selected.previousState) {
    return (
      <div class="state-pane">
        <pre>{JSON.stringify(selected.state, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div class="state-pane">
      <pre>{JSON.stringify(selected.actionResult, null, 2)}</pre>
    </div>
  )
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

interface DebuggerOptionsProps {
  state: State
  actions: Actions
}

const DebuggerOptions = (props: DebuggerOptionsProps) => {
  const { state, actions } = props

  return (
    <div class="debugger-options">
      <div class="form-group option">
        <label class="form-checkbox">
          <input
            type="checkbox"
            checked={state.debug.collapseRepeatingActions}
            onchange={actions.debug.toggleCollapseRepeatingActions}
          />
          <i class="form-icon" /> Group repeating actions
        </label>
      </div>
      <div class="form-group option">
        <label class="form-checkbox">
          <input
            type="checkbox"
            checked={state.debug.showFullState}
            onchange={actions.debug.toggleShowFullState}
          />
          <i class="form-icon" /> Show full state
        </label>
      </div>
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
    <div class="debug-pane">
      {Title(actions)}
      {DebuggerOptions({ state, actions })}
      <SplitPane pane0Percent={40}>
        {RunsPane({ state, actions, runs })}
        {StatePane({ state, actions, runs })}
      </SplitPane>
    </div>
  )
}
