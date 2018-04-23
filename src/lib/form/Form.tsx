import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { FormField } from "./FormField"

export interface FieldProps {
  name: string
  placeholder?: string
  label?: string
  class?: string
  type: string
}

export interface FormProps {
  state: State
  actions: Actions
  active: boolean
  title: string
  submit()
  fields: FieldProps[]
  fieldSize?: "sm" | "lg"
  horizontal?: string[]
}

export function Form(props: FormProps) {
  const {
    state,
    actions,
    fields,
    horizontal = ["col-sm-12", "col-12 col-sm-12 py-1"],
    fieldSize
  } = props
  const className = fieldSize ? "input-" + fieldSize : ""
  return (
    <form
      oncreate={e => e.elements[0].focus()}
      onsubmit={e => {
        e.preventDefault()
        props.submit()
      }}
      class={horizontal ? "form-horizontal" : ""}
    >
      <h3>{props.title}</h3>
      {fields.map(f =>
        FormField({
          ...f,
          state: state[f.name],
          setField: actions.setField,
          horizontal,
          class: className
        })
      )}
      <div class="text-right py-6">
        <button class="btn btn-lg btn-primary btn-block" type="submit">
          Register
        </button>
      </div>
    </form>
  )
}
