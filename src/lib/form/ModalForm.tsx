import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { FormField } from "./FormField"

export interface ModalFieldProps {
  name: string
  /** Only used for inputs (no options in the field definition). */
  placeholder?: string
  label?: string
  class?: string
  type?: string
  disabled?: boolean
  onchange?(value: any)
}

export interface ModalFormProps {
  state: State
  actions: Actions
  active: boolean
  title: string
  submit(state: State)
  close()
  canSubmit?(): boolean
  fields: ModalFieldProps[]
  size?: "sm" | "lg"
  titleTag?: string
  horizontal?: string[]
}

export function ModalForm(props: ModalFormProps) {
  const {
    state,
    actions,
    fields,
    horizontal = ["col-3 col-sm-12", "col-9 col-sm-12"],
    titleTag = "h3",
    close,
    canSubmit = () => true
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
        titleTag={titleTag}
        size={props.size}
        Footer={() => (
          <div>
            <button class="btn btn-secondary" onclick={cancel} type="button">
              Cancel
            </button>{" "}
            <button
              class="btn btn-primary"
              type="submit"
              disabled={!canSubmit()}
            >
              Submit
            </button>
          </div>
        )}
      >
        {fields.map(f =>
          FormField({
            ...f,
            state: state[f.name],
            setField: actions.setField,
            horizontal
          })
        )}
      </Modal>
    </form>
  )
}
