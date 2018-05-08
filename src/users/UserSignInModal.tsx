import { h } from "hyperapp"

import { ModalForm } from "lib/form"

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

  return ModalForm({
    state: state.signInModal,
    actions: actions.signInModal,
    close: actions.hideSignInModal,
    title: "Sign in with email",
    submit: actions.signIn,
    fields: [
      { name: "email", label: "Email", type: "text", disabled: state.loading },
      {
        name: "password",
        label: "Password",
        type: "password",
        disabled: state.loading
      }
    ]
  })
}
