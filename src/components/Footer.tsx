import { h } from "hyperapp"

import { State, Actions } from "api"

import { UserSignInModal, UserSignUpModal } from "users"
import { CreateProjectModal } from "./CreateProjectModal"

import "./Footer.scss"
import { ShortcutsModal } from "editor"
import { Button } from "lib/components"

export interface FooterProps {
  state: State
  actions: Actions
}

function ShortcutsButton(props: FooterProps) {
  const { state, actions } = props
  if (
    state.editor.status === "editing" ||
    state.editor.status === "read-only"
  ) {
    return (
      <a
        class="text-light"
        href="#"
        onclick={actions.editor.ui.showShortcutsModal}
      >
        Shortcuts
      </a>
    )
  }

  return null
}

export function Footer(props: FooterProps) {
  const { state, actions } = props
  return (
    <div>
      <footer class="footer navbar bg-dark">
        <section class="navbar-center">
          <ShortcutsButton state={state} actions={actions} />
        </section>
        <section class="navbar-center">
          <a
            href="https://github.com/hyperstart/hyperstart.io"
            class="text-light"
            target="_blank"
          >
            Github
          </a>{" "}
          |
          <a
            href="https://hyperapp.slack.com/messages/C9CDF88P9"
            class="text-light"
            target="_blank"
          >
            Slack
          </a>
        </section>
        <section class="navbar-center" />
      </footer>
      <UserSignInModal state={state.users} actions={actions.users} />
      <UserSignUpModal state={state.users} actions={actions.users} />
      <CreateProjectModal state={state} actions={actions} />
      <ShortcutsModal state={state.editor} actions={actions.editor} />
    </div>
  )
}
