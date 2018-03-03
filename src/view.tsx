import { h } from "hyperapp"

import { State, Actions } from "./api"
import { Header } from "./components"

import "./view.scss"

export function view(state: State, actions: Actions) {
  return <main class="main">{Header({ state, actions })}</main>
}
