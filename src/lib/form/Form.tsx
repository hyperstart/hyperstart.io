import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { Field } from "./Field"

export interface FormFieldProps {
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
  fields: FormFieldProps[]
  size?: "sm" | "lg"
  horizontal?: string[]
}

export function Form(props: FormProps) {
  const {
    state,
    actions,
    fields,
    horizontal = ["col-3 col-sm-12", "col-9 col-sm-12"]
  } = props

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
      {fields.map(f => Field({ ...f, state, actions, horizontal }))}
      <div>
        <button class="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  )
}
