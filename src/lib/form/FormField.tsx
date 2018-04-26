import { h } from "hyperapp"

import { FormFieldState, FormFieldUpdate } from "./api"

// # Field

export interface FormFieldProps {
  state: FormFieldState
  setField(payload: FormFieldUpdate)
  onchange?(value: any)
  name?: string
  placeholder?: string
  label?: string
  class?: string
  type?: string
  horizontal?: string[]
  disabled?: boolean
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

function Select(props: FormFieldProps) {
  const { state, setField, name, horizontal, placeholder, disabled } = props
  const error = state.error
  const value = state.value
  const loading = state.loading
  const setValue = e => {
    e.preventDefault()
    const value = e.target.value
    setField({ field: name, value })
    if (props.onchange) {
      props.onchange(value)
    }
  }

  const elements = [
    <select
      onchange={setValue}
      value={state.value}
      class={`form-select ${props.class || ""}`}
      placeholder={placeholder}
      disabled={disabled || state.loading}
    >
      {state.options.map(opt => <option value={opt.value}>{opt.label}</option>)}
    </select>,
    loading && <i class="form-icon loading" />,
    <p class="form-input-hint">{error}</p>
  ]

  if (horizontal) {
    return (
      <div class={horizontal[1] + (loading ? " has-icon-right" : "")}>
        {elements}
      </div>
    )
  }
  if (loading) {
    return <div class="has-icon-right">{elements}</div>
  }
  return elements
}

function Input(props: FormFieldProps) {
  const {
    state,
    setField,
    name,
    placeholder = "",
    type,
    horizontal,
    disabled
  } = props
  const error = state.error
  const loading = state.loading
  const value = state.value
  const setValue = e => {
    e.preventDefault()
    const value = e.target.value
    setField({ field: name, value })
    if (props.onchange) {
      props.onchange(value)
    }
  }

  const elements = [
    <input
      placeholder={placeholder}
      value={value}
      oninput={setValue}
      type={type}
      class={`form-input ${props.class || ""}`}
      disabled={disabled || state.loading}
    />,
    loading && <i class="form-icon loading" />,
    <p class="form-input-hint">{error}</p>
  ]

  if (horizontal) {
    return (
      <div class={horizontal[1] + (loading ? " has-icon-right" : "")}>
        {elements}
      </div>
    )
  }
  if (loading) {
    return <div class="has-icon-right">{elements}</div>
  }
  return elements
}

function Checkbox(props: FormFieldProps) {
  const { state, setField, name, horizontal, disabled } = props
  const error = state.error
  const value = state.value
  const setValue = e => {
    e.preventDefault()
    const value = e.target.checked
    setField({ field: name, value })
    if (props.onchange) {
      props.onchange(value)
    }
  }

  const elements = [
    <label class="form-checkbox">
      <input
        type="checkbox"
        checked={value}
        onchange={setValue}
        class={props.class || ""}
        disabled={disabled || state.loading}
      />
      {props.label && h("i", { class: "form-icon" })}
      {props.label}
    </label>,
    <p class="form-input-hint">{error}</p>
  ]

  if (horizontal) {
    return <div class={horizontal[1]}>{elements}</div>
  }
  return elements
}

export function FormField(props: FormFieldProps) {
  const { state, name, type } = props
  const checkbox = typeof state.value === "boolean"
  return (
    <div
      class={`form-group ${state.error ? "has-error" : ""}`}
      style={{ display: type === "hidden" && "none" }}
    >
      {!checkbox && Label(props)}
      {checkbox
        ? Checkbox(props)
        : state.options
          ? Select(props)
          : Input(props)}
    </div>
  )
}
