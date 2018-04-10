import { h } from "hyperapp"

import "./RunsPaneItem.scss"

import { State, Actions, Run } from "../api"
import { RunActionItemList } from "./RunActionItemList"

export interface RunsPaneItemProps {
  state: State
  actions: Actions
  run: Run
  current: boolean
}

export function RunsPaneItem(props: RunsPaneItemProps) {
  const { state, actions, run, current } = props
  const date = new Date(run.timestamp).toLocaleTimeString()
  const collapsed = run.collapsed

  return (
    <li class="run-pane-item" key={run.timestamp}>
      <h6>Run - {date}</h6>
      {RunActionItemList({
        state,
        actions,
        run,
        collapsed,
        actionList: run.actions,
        path: []
      })}
    </li>
  )
}

/*


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



*/
