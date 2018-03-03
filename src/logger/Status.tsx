import { h } from "hyperapp"

import { State, Actions } from "./api"

export interface StatusProps {
  state: State
  actions: Actions
}

function StatusChip({ type, message, onClose }) {
  return (
    <span class="centered text-light">
      <span class={"text-bold text-" + type}>{message}</span>
      <a
        href="#"
        class="btn btn-clear text-light"
        aria-label="Close"
        role="button"
        onclick={onClose}
        style={{ "margin-bottom": "4px" }}
      />
    </span>
  )
}

const types = {
  warning: "warning",
  error: "error",
  success: "light",
  info: "light"
}

export function Status(props: StatusProps) {
  const { state, actions } = props

  if (state.current) {
    const entry = state.current
    switch (entry.severity) {
      case "loading":
        return (
          <span class="centered">
            {entry.message || ""}
            <i class="fa fa-spinner fa-pulse fa-2x fa-fw fa-inverse" />
            <span class="sr-only">Loading...</span>
          </span>
        )
      default:
        return StatusChip({
          message: entry.message,
          type: types[entry.severity],
          onClose: (e: Event) => {
            e.preventDefault()
            actions.clearCurrent()
          }
        })
    }
  }

  return ""
}
