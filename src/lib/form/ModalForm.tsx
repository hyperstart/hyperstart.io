import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { FormField, Field } from "./FormField"

export interface ModalFormProps {
  state: State
  actions: Actions
  active?: boolean
  title: string
  submit(state: State)
  close()
  canSubmit?(): boolean
  fields: Field[]
  size?: "sm" | "lg"
  titleTag?: string
  horizontal?: string[] | false
}

export function ModalForm(props: ModalFormProps) {
  const {
    state,
    actions,
    fields,
    horizontal = ["col-3 col-sm-12", "col-9 col-sm-12"],
    titleTag = "h3",
    close,
    canSubmit = () => true,
    active = true
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
        active={active}
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
