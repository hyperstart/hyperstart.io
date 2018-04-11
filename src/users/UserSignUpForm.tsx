import { h } from "hyperapp"

import { Form } from "lib/form"

import { State, Actions } from "./api"

export interface UserSignUpFormProps {
  state: State
  actions: Actions
}

export function UserSignUpForm(props: UserSignUpFormProps) {
  const { state, actions } = props

  return Form({
    state: state.signUpForm,
    actions: actions.signUpForm,
    active: true,
    title: "Sign up with email/password",
    submit: actions.signUp,
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "password", label: "Password", type: "password" },
      { name: "confirmPassword", label: "Confirm Password", type: "password" }
    ]
  })
}
