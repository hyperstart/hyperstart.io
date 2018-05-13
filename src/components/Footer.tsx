import { h } from "hyperapp"

import { State, Actions } from "api"

import { UserSignInModal, UserSignUpModal } from "users"
import { CreateProjectModal } from "./CreateProjectModal"

import "./Footer.scss"
import { EmbedModal, ShortcutsModal } from "editor"
import { Button } from "lib/components"
import { Link } from "lib/router"
import { isInIframe } from "selectors"

export interface FooterProps {
  state: State
  actions: Actions
}

function ShortcutsButton(props: FooterProps) {
  const { state, actions } = props
  if (state.editor.status !== "closed") {
    return (
      <a
        class="text-light hide-sm"
        href="#"
        onclick={actions.editor.ui.openShortcutsModal}
      >
        Shortcuts
      </a>
    )
  }

  return null
}

export function Footer(props: FooterProps) {
  const { state, actions } = props
  if (isInIframe()) {
    return (
      <div>
        <ShortcutsModal state={state.editor} actions={actions.editor} />
      </div>
    )
  }

  return (
    <div>
      <footer class="footer navbar">
        <section class="navbar-section">
          <ShortcutsButton state={state} actions={actions} />
        </section>
        <section class="navbar-center">
          <a
            href="https://twitter.com/HyperstartJS"
            class="text-light"
            target="_blank"
          >
            Twitter
          </a>
          |
          <Link
            href="https://blog.hyperstart.io"
            target="_blank"
            class="text-light"
          >
            Blog
          </Link>
          |
          <Link href="/about" class="text-light">
            About
          </Link>
          |
          <a
            href="mailto:contact@hyperstart.io"
            class="text-light"
            target="_blank"
          >
            Contact
          </a>
          |
          <a
            href="https://github.com/hyperstart/hyperstart.io"
            class="text-light"
            target="_blank"
          >
            Github
          </a>
          |
          <a
            href="https://hyperapp.slack.com/messages/C9CDF88P9"
            class="text-light"
            target="_blank"
          >
            Slack
          </a>
        </section>
        <section class="navbar-section">
          <a
            href="https://github.com/hyperstart/hyperstart.io/releases/tag/v0.4.0"
            class="text-light hide-sm"
            target="_blank"
          >
            v0.4.0
          </a>
        </section>
      </footer>
      <UserSignInModal state={state.users} actions={actions.users} />
      <UserSignUpModal
        state={state.users}
        actions={actions.users}
        log={actions.logger.log}
      />
      <CreateProjectModal state={state} actions={actions} />
      <ShortcutsModal state={state.editor} actions={actions.editor} />
      <EmbedModal state={state.editor} actions={actions.editor} />
    </div>
  )
}
