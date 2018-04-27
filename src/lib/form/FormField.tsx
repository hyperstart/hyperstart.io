import { h } from "hyperapp"

import { FormFieldState, FormFieldUpdate } from "./api"

// # Field

export interface BaseField {
  onchange?(value: any)
  label?: string
  name?: string
  class?: string
  horizontal?: string[] | false
  disabled?: boolean
  loading?: boolean
}

export interface BaseProps {
  state: FormFieldState
  setField(payload: FormFieldUpdate)
}

export type Field = SelectField | InputField | CheckboxField | RadioField

export type FormFieldProps =
  | SelectProps
  | InputProps
  | CheckboxProps
  | RadioProps

// # Label

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

// # Select

export interface SelectField extends BaseField {
  type: "select"
}

export interface SelectProps extends SelectField, BaseProps {
  // empty
}

function Select(props: SelectProps) {
  const { state, setField, name, horizontal } = props
  const error = state.error
  const value = state.value
  const loading = state.loading || props.loading
  const disabled = loading || props.disabled
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
      disabled={disabled}
      class={`form-select ${props.class || ""}`}
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

// # Radio

export interface RadioField extends BaseField {
  type: "radio"
}

export interface RadioProps extends RadioField, BaseProps {
  // empty
}

function Radio(props: RadioProps) {
  const { state, setField, name, horizontal } = props
  const error = state.error
  const value = state.value
  const loading = state.loading || props.loading
  const disabled = loading || props.disabled
  const setValue = e => {
    e.preventDefault()
    const value = e.target.name
    setField({ field: name, value })
    if (props.onchange) {
      props.onchange(value)
    }
  }

  const options = state.options.map(opt => {
    return (
      <label class="form-radio">
        <input
          type="radio"
          name={opt.value}
          checked={opt.value === state.value}
          disabled={disabled}
          onchange={setValue}
        />
        <i class="form-icon" /> {opt.label}
      </label>
    )
  })

  if (horizontal) {
    return <div class={horizontal[1]}>{options}</div>
  }
  return options
}

// # Input

export interface InputField extends BaseField {
  type:
    | "text"
    | "email"
    | "url"
    | "password"
    | "number"
    | "date"
    | "color"
    | "file"
  placeholder?: string
}

interface InputProps extends InputField, BaseProps {
  // empty
}

function Input(props: InputProps) {
  const { state, setField, name, placeholder = "", type, horizontal } = props
  const error = state.error
  const value = state.value
  const loading = state.loading || props.loading
  const disabled = loading || props.disabled
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
      disabled={disabled}
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

// # Checkbox

export interface CheckboxField extends BaseField {
  type: "checkbox" | "switch"
}

export interface CheckboxProps extends CheckboxField, BaseProps {
  // empty
}

function Checkbox(props: CheckboxProps) {
  const { type, state, setField, name, horizontal } = props
  const error = state.error
  const value = state.value
  const loading = state.loading || props.loading
  const disabled = loading || props.disabled
  const setValue = e => {
    e.preventDefault()
    const value = e.target.checked
    setField({ field: name, value })
    if (props.onchange) {
      props.onchange(value)
    }
  }

  const elements = [
    <label class={`form-${type}`}>
      <input
        type="checkbox"
        checked={value}
        onchange={setValue}
        class={props.class || ""}
        disabled={disabled}
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

function Field(props: FormFieldProps) {
  switch (props.type) {
    case "checkbox":
    case "switch":
      return Checkbox(props)
    case "select":
      return Select(props)
    case "radio":
      return Radio(props)
    default:
      return Input(props)
  }
}

export function FormField(props: FormFieldProps) {
  const { state, type } = props
  const checkbox = type === "checkbox" || type === "switch"
  return (
    <div class={`form-group ${state.error ? "has-error" : ""}`}>
      {!checkbox && Label(props)}
      {Field(props)}
    </div>
  )
}
