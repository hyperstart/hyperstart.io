import { h } from "hyperapp"

import { ModalForm } from "lib/form"

import { State, Actions } from "./api"
import { LogFn } from "logger"

export interface UserSignUpModalProps {
  state: State
  actions: Actions
  log: LogFn
}

export function UserSignUpModal(props: UserSignUpModalProps) {
  const { state, actions, log } = props

  if (!state.signUpModal) {
    return <div />
  }

  return ModalForm({
    state: state.signUpModal,
    actions: actions.signUpModal,
    close: actions.hideSignUpModal,
    title: "Sign up with email/password",
    submit: () => log(actions.signUp("modal")),
    fields: [
      { name: "email", label: "Email", type: "text", disabled: state.loading },
      {
        name: "password",
        label: "Password",
        type: "password",
        disabled: state.loading
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        disabled: state.loading
      }
    ]
  })
}
