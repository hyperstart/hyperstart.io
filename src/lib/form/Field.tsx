import { h } from "hyperapp"

import { State, Actions } from "./api"

// # Field

export interface FieldProps {
  name: string
  state: State
  actions: Actions
  placeholder?: string
  label?: string
  class?: string
  type: string
  horizontal?: string[]
}

function Label(props: FieldProps) {
  const { label, horizontal } = props
  if (!label) {
    return null
  }
  if (horizontal) {
    return (
      <div class={horizontal[0]}>
        <label class="form-label">{label}</label>
      </div>
    )
  }

  return <label class="form-label">{label}</label>
}

function Input(props: FieldProps) {
  const { state, actions, name, placeholder = "", type, horizontal } = props
  const error = state[name].error
  const value = state[name].value
  const setValue = e => {
    e.preventDefault()
    actions.setField({ field: name, value: e.target.value })
  }
  if (horizontal) {
    return (
      <div class={horizontal[1]}>
        <input
          placeholder={placeholder}
          value={value}
          oninput={setValue}
          type={type}
          class={`form-input ${props.class || ""}`}
        />
        {<p class="form-input-hint">{error}</p>}
      </div>
    )
  }
  return [
    <input
      placeholder={placeholder}
      value={value}
      oninput={setValue}
      type={type}
      class={`form-input ${props.class || ""}`}
    />,
    <p class="form-input-hint">{error}</p>
  ]
}

export function Field(props: FieldProps) {
  const { state, name, type } = props
  const error = state[name].error
  return (
    <div
      class={`form-group ${error ? "has-error" : ""}`}
      style={{ display: type === "hidden" && "none" }}
    >
      {Label(props)}
      {Input(props)}
    </div>
  )
}
