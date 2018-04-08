import { h } from "hyperapp"

import { ProjectsSearch } from "lib/search/ProjectsSearch"

import { State, Actions } from "api"
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
      {ProjectsSearch({
        state: state.search,
        actions: actions.search,
        log: actions.logger.log
      })}
    </div>
  )
}
