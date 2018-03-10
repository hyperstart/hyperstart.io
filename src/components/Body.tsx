import { h } from "hyperapp"

import { replace, Routes } from "lib/router"

import { State, Actions } from "api"

import { IndexPage } from "./IndexPage"
import { ProjectEditorPage } from "./ProjectEditorPage"
import { ProjectSearchPage } from "./ProjectSearchPage"

export interface BodyProps {
  state: State
  actions: Actions
}

export function Body(props: BodyProps) {
  return Routes({
    routes: [
      { path: "/", view: IndexPage, exact: true },
      { path: "/projects/:id", view: ProjectEditorPage },
      { path: "/projects", view: ProjectSearchPage, exact: true },
      { path: "*", view: () => replace("/") && "" }
    ],
    routeProps: props
  })
}
