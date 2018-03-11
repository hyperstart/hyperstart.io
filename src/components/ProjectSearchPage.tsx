import { h } from "hyperapp"

import { ProjectsSearch } from "lib/search/ProjectsSearch"

import { State, Actions } from "api"
import { CreateProjectModal } from "./CreateProjectModal"

import "./ProjectSearchPage"
import { LogFn } from "logger"

export interface ProjectSearchPageProps {
  state: State
  actions: Actions
  log: LogFn
}

export function ProjectSearchPage(props: ProjectSearchPageProps) {
  const { state, actions, log } = props

  return (
    <div class="project-search-page">
      {ProjectsSearch({ state: state.search, actions: actions.search, log })}
      {CreateProjectModal(props)}
    </div>
  )
}
