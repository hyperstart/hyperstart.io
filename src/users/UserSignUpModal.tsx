import { h } from "hyperapp"

import { Modal } from "lib/components"
import { Field } from "lib/form"

import { State, Actions } from "./api"

export interface UserSignUpModalProps {
  state: State
  actions: Actions
}

export function UserSignUpModal(props: UserSignUpModalProps) {
  const { state, actions } = props

  if (!state.signUpModal) {
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
        close={actions.hideSignUpModal}
        title="Sign In with Email"
        Footer={() => (
          <div>
            <button class="btn" onclick={actions.hideSignUpModal}>
              Cancel
            </button>{" "}
            <button class="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        )}
      >
        <Field
          state={state.signUpModal}
          actions={actions.signUpModal}
          label="Email"
          name="email"
          type="text"
        />
        <Field
          state={state.signUpModal}
          actions={actions.signUpModal}
          label="Password"
          name="password"
          type="password"
        />
        <Field
          state={state.signUpModal}
          actions={actions.signUpModal}
          label="Confirm Password"
          name="confirmPassword"
          type="password"
        />
      </Modal>
    </form>
  )
}
