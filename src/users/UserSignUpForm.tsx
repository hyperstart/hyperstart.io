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
    title: "Register for an Account",
    submit: actions.signUp,
    fieldSize: "lg",
    fields: [
      { name: "email", placeholder: "Email", type: "text" },
      {
        name: "password",
        placeholder: "Password",
        type: "password"
      },
      {
        name: "confirmPassword",
        placeholder: "Confirm Password",
        type: "password"
      }
    ]
  })
}
