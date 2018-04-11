import { h } from "hyperapp"

import { ModalForm } from "lib/form"

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

  return ModalForm({
    state: state.signUpModal,
    actions: actions.signUpModal,
    active: true,
    close: actions.hideSignUpModal,
    title: "Sign up with email/password",
    submit: () => actions.signUp("modal"),
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "confirmPassword", label: "Confirm Password", type: "password" }
    ]
  })
}
