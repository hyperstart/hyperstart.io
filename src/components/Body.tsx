import { h } from "hyperapp"

import { replace, Routes } from "lib/router"

import { State, Actions } from "api"

import { IndexPage } from "./IndexPage"
import { ProjectEditorPage } from "./ProjectEditorPage"
import { ProjectSearchPage } from "./ProjectSearchPage"
// import { PageTemplate } from "./PageTemplate"

export interface BodyProps {
  state: State
  actions: Actions
}

export function Body(props: BodyProps) {
  const { state, actions } = props
  return Routes({
    routes: [
      { path: "/", view: IndexPage, exact: true },
      { path: "/projects/:id", view: ProjectEditorPage },
      { path: "/projects", view: ProjectSearchPage, exact: true },
      // { path: "/my-page", view: PageTemplate, exact: true },
      { path: "*", view: () => replace("/") && "" }
    ],
    routeProps: { state, actions, log: actions.logger.log }
  })
}
