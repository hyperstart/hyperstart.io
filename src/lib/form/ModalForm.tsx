import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { Field } from "./Field"

export interface ModalFieldProps {
  name: string
  placeholder?: string
  label?: string
  class?: string
  type: string
}

export interface ModalFormProps {
  state: State
  actions: Actions
  active: boolean
  title: string
  submit(state: State)
  close()
  fields: ModalFieldProps[]
  size?: "sm" | "lg"
  horizontal?: string[]
}

export function ModalForm(props: ModalFormProps) {
  const {
    state,
    actions,
    fields,
    horizontal = ["col-3 col-sm-12", "col-9 col-sm-12"],
    close
  } = props

  const cancel = (e: Event) => {
    e.preventDefault()
    close()
  }

  return (
    <form
      oncreate={e => e.elements[0].focus()}
      onsubmit={e => {
        e.preventDefault()
        props.submit(state)
      }}
      class={horizontal ? "form-horizontal" : ""}
    >
      <Modal
        active={props.active}
        close={props.close}
        title={props.title}
        size={props.size}
        Footer={() => (
          <div>
            <button class="btn" onclick={cancel} type="button">
              Cancel
            </button>{" "}
            <input class="btn btn-primary" type="submit">
              Submit
            </input>
          </div>
        )}
      >
        {fields.map(f => Field({ ...f, state, actions, horizontal }))}
      </Modal>
    </form>
  )
}
