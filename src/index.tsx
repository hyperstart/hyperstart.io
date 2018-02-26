import { h, app } from "hyperapp"

// import { combineModules } from "./utils"

const state = {
  name: "world"
}

const actions = {
  init: () => {}
}

const view = (state, actions) => <div>Hello {state.name}!</div>

app(state, actions, view, document.body).init()
