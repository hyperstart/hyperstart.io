import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { Field } from "./Field"

export interface ModalFieldProps {
  name: string
  placeholder?: string
  label?: string
  id?: string
  class?: string
  type: string
}

export interface ModalFormProps {
  state: State
  actions: Actions
  active: boolean
  title: string
  submit()
  close()
  fields: ModalFieldProps[]
}

export function ModalForm(props: ModalFormProps) {
  const { state, actions, active, close, title, fields } = props
  return (
    <form
      oncreate={e => e.elements[0].focus()}
      onsubmit={e => {
        e.preventDefault()
        props.submit()
      }}
    >
      <Modal
        active={active}
        close={close}
        title={title}
        Footer={() => (
          <div>
            <button class="btn" onclick={close}>
              Cancel
            </button>{" "}
            <button class="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        )}
      >
        {fields.map(f => Field({ ...f, state, actions }))}
      </Modal>
    </form>
  )
}
