import { h } from "hyperapp"

import { Link } from "lib/router"

import { State, Actions } from "api"
import { Status } from "logger"

import "./Header.scss"

export interface HeaderProps {
  state: State
  actions: Actions
}

function CreateButton(props: HeaderProps) {
  // TODO
  return null
}

export function Header(props: HeaderProps) {
  const { state, actions } = props
  return (
    <header class="header navbar bg-dark">
      <section class="navbar-section">
        <Link href="/" class="navbar-brand mr-2 text-light">
          Hyperstart
        </Link>
        {CreateButton(props)}
      </section>
      <section class="navbar-section">
        {Status({ state: state.logger, actions: actions.logger })}
      </section>
      <section class="navbar-section">[User]</section>
    </header>
  )
}
