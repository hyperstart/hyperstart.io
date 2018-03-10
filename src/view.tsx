import { h } from "hyperapp"

import { State, Actions } from "./api"
import { Header, Body } from "./components"

import "./view.scss"

let iteration = 0

export function view(state: State, actions: Actions) {
  return (
    <main class="main">
      {Header({ state, actions })}
      {Body({ state, actions })}
    </main>
  )
}
