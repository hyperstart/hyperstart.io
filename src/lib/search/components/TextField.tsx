import { h } from "hyperapp"

import { State, Actions } from "../api"
import { LogFn } from "logger"

export interface TextFieldProps {
  state: State
  actions: Actions
  type: "field" | "pane"
  name: string
  log: LogFn
  placeholder?: string
  displaySearchButton?: boolean
}

export function TextField(props: TextFieldProps) {
  const { state, actions, log, name, type } = props
  const valueAttr = type === "field" ? "fieldText" : "paneText"
  const search = state[name] || {}
  return (
    <form
      onsubmit={(e: Event) => {
        e.preventDefault()
        log(actions.search({ name, type }))
      }}
    >
      <div class="input-group">
        <input
          type="text"
          class="form-input"
          placeholder={props.placeholder || "Search..."}
          value={search[valueAttr] || ""}
          onchange={e => {
            actions.update({ name, [valueAttr]: e.target.value })
            e.preventDefault()
          }}
        />
        {props.displaySearchButton ? (
          <button class="btn btn-primary input-group-btn">Search</button>
        ) : null}
      </div>
    </form>
  )
}
