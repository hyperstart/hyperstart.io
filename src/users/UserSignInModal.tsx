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
    <form
      oncreate={e => e.elements[0].focus()}
      onsubmit={e => {
        e.preventDefault()
        // TODO
      }}
    >
      <Modal
        active={true}
        close={actions.hideSignInModal}
        title="Sign In with Email"
        Footer={() => (
          <div>
            <button class="btn" onclick={actions.hideSignInModal}>
              Cancel
            </button>{" "}
            <button class="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        )}
      >
        <Field
          state={state.signInModal}
          actions={actions.signInModal}
          label="Email"
          name="email"
          type="text"
        />
        <Field
          state={state.signInModal}
          actions={actions.signInModal}
          label="Password"
          name="password"
          type="password"
        />
      </Modal>
    </form>
  )
}
