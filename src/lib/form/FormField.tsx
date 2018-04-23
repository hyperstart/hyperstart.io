import { h } from "hyperapp"

import { FormFieldState, FormFieldUpdate } from "./api"

// # Field

export interface FormFieldProps {
  state: FormFieldState
  setField(payload: FormFieldUpdate)
  name?: string
  placeholder?: string
  label?: string
  class?: string
  type: string
  horizontal?: string[]
}

function Label(props: FormFieldProps) {
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

function Input(props: FormFieldProps) {
  const { state, setField, name, placeholder = "", type, horizontal } = props
  const error = state.error
  const value = state.value
  const setValue = e => {
    e.preventDefault()
    setField({ field: name, value: e.target.value })
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

export function FormField(props: FormFieldProps) {
  const { state, name, type } = props
  return (
    <div
      class={`form-group ${state.error ? "has-error" : ""}`}
      style={{ display: type === "hidden" && "none" }}
    >
      {Label(props)}
      {Input(props)}
    </div>
  )
}
