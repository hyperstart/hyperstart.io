import { h } from "hyperapp"

import { Modal } from "lib/components"
import { Field } from "lib/form"

import { State, Actions } from "./api"

export interface UserSignInModalProps {
  state: State
  actions: Actions
}

export function UserSignInModal(props: UserSignInModalProps) {
  const { state, actions } = props

  if (!state.signInModal) {
    return <div />
  }

  return (
    <Modal
      active={true}
      close={actions.hideSignInModal}
      title="Sign In with Email"
    >
      <form
        oncreate={e => e.elements[0].focus()}
        onsubmit={e => {
          e.preventDefault()
          // TODO
        }}
      >
        <Field
          state={state.signInModal}
          actions={actions.signInModal}
          placeholder="Email"
          name="email"
          type="text"
        />
        <Field
          state={state.signInModal}
          actions={actions.signInModal}
          name="password"
          type="password"
        />
      </form>
    </Modal>
  )
}
