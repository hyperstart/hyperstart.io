import { h } from "hyperapp"

import { ProjectsSearch } from "lib/search/ProjectsSearch"

import { State, Actions } from "api"
import { LogFn } from "logger"

import { CreateProjectModal } from "./CreateProjectModal"

import "./IndexPage.scss"

export interface IndexPageProps {
  state: State
  actions: Actions
  log: LogFn
}

export function IndexPage(props: IndexPageProps) {
  const { state, actions, log } = props

  return (
    <div class="index-page">
      <h1>Welcome to Hyperstart</h1>
      <p>
        This application allows you to create and share javascript projects,
        ranging from code snippets to fully-fledged projects, with{" "}
        <em>zero setup</em>. In particular, projects built with{" "}
        <a href="https://github.com/hyperapp/hyperapp" target="_blank">
          Hyperapp
        </a>.
      </p>
      <p>
        Start exploring with the search below, or{" "}
        <a
          href="#"
          onclick={e => {
            e.preventDefault()
            props.actions.ui.openCreateProject()
          }}
        >
          create a new project.
        </a>
      </p>
      {ProjectsSearch({ state: state.search, actions: actions.search, log })}
      {CreateProjectModal(props)}
    </div>
  )
}
