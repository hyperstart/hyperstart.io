import { h } from "hyperapp"

import { State, Actions } from "./api"

// # Field

export interface FieldProps {
  name: string
  state: State
  actions: Actions
  placeholder?: string
  label?: string
  id?: string
  class?: string
  type: string
}

export function Field(props: FieldProps) {
  const { state, actions, name, label, id, placeholder = "", type } = props
  const error = state.fields[name].error
  const value = state.fields[name].value
  const setValue = e => {
    e.preventDefault()
    actions.setField({ field: name, value: e.target.value })
  }
  return (
    <div
      class={`form-group ${error ? "has-error" : ""}`}
      style={{ display: type === "hidden" && "none" }}
    >
      {label && (
        <label class="form-label" for={id}>
          {label}
        </label>
      )}
      <input
        placeholder={placeholder}
        value={value}
        oninput={setValue}
        type={type}
        class={`form-input ${props.class || ""}`}
      />
      {error && <p class="form-input-hint">{error}</p>}
    </div>
  )
}
