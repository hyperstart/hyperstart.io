import { h } from "hyperapp"

import { State, Actions } from "api"

import { UserSignInModal, UserSignUpModal } from "users"
import { CreateProjectModal } from "./CreateProjectModal"

import "./Footer.scss"

export interface FooterProps {
  state: State
  actions: Actions
}

export function Footer(props: FooterProps) {
  const { state, actions } = props
  return (
    <div>
      <footer class="footer navbar bg-dark">
        <section class="navbar-center" />
        <section class="navbar-center">
          <a
            href="https://github.com/hyperstart/hyperstart.io"
            class="text-light"
          >
            Github
          </a>{" "}
          |
          <a
            href="https://hyperapp.slack.com/messages/C9CDF88P9"
            class="text-light"
          >
            Slack
          </a>
        </section>
        <section class="navbar-center" />
      </footer>
      <UserSignInModal state={state.users} actions={actions.users} />
      <UserSignUpModal state={state.users} actions={actions.users} />
      <CreateProjectModal state={state} actions={actions} />
    </div>
  )
}
