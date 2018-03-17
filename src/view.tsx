import { h } from "hyperapp"

import { State, Actions } from "./api"
import { Header, Body, Footer } from "./components"

import "./view.scss"

export function view(state: State, actions: Actions) {
  const log = actions.logger.log
  return (
    <main class="main">
      {Header({ state, actions, log })}
      {Body({ state, actions })}
      {Footer({ state, actions })}
    </main>
  )
}
