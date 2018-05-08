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
    submit: () => actions.signUp("form"),
    fieldSize: "lg",
    fields: [
      {
        name: "email",
        placeholder: "Email",
        type: "text",
        disabled: state.loading
      },
      {
        name: "password",
        placeholder: "Password",
        type: "password",
        disabled: state.loading
      },
      {
        name: "confirmPassword",
        placeholder: "Confirm Password",
        type: "password",
        disabled: state.loading
      }
    ]
  })
}
