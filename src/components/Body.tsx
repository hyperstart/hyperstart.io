import { h } from "hyperapp"

import { replace, Routes } from "lib/router"

import { State, Actions } from "../api"

export interface BodyProps {
  state: State
  actions: Actions
}

function IndexPage() {
  return <div>Index</div>
}

function ProjectEditorPage() {
  return <div>Editor</div>
}

function ProjectSearchPage() {
  return <div>Projects</div>
}

function RediredToIndexPage() {
  replace("/")
  return <div>Redirect</div>
}

export function Body(props: BodyProps) {
  return Routes({
    routes: [
      { path: "/", view: IndexPage, exact: true },
      { path: "/projects/:id", view: ProjectEditorPage },
      { path: "/projects", view: ProjectSearchPage, exact: true },
      { path: "*", view: RediredToIndexPage }
    ]
  })
}
