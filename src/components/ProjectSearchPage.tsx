import { h } from "hyperapp"

import { State, Actions } from "api"
import { ProjectsSearch } from "search"
import { CreateProjectModal } from "./CreateProjectModal"

import "./ProjectSearchPage"

export interface ProjectSearchPageProps {
  state: State
  actions: Actions
}

export function ProjectSearchPage(props: ProjectSearchPageProps) {
  const { state, actions } = props

  return (
    <div class="project-search-page">
      {ProjectsSearch({ state: state.search, actions: actions.search })}
      {CreateProjectModal({ state, actions })}
    </div>
  )
}
