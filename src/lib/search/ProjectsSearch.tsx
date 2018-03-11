import { h } from "hyperapp"

import { UrlIcon } from "lib/components"
import { replace } from "lib/router"

import { Details } from "projects/api"
import { ProjectOwner } from "projects/components"

import { SearchPane } from "./SearchPane"
import { State, Actions } from "./api"
import { LogFn } from "logger"

// # Search Project

function SingleProject(result: Details) {
  return (
    <div class="tile">
      <div class="tile-content">
        <h5 class="tile-title">
          <a
            class="btn btn-link"
            href={"/projects/" + result.id}
            onclick={e => {
              e.preventDefault()
              replace("/projects/" + result.id)
            }}
          >
            {result.name}
          </a>
          {result.url ? (
            <small>
              <UrlIcon url={result.url} />
            </small>
          ) : null}
          {result.version ? <small> v{result.version}</small> : null}
        </h5>
        <p class="tile-subtitle">
          <ProjectOwner project={result} />
        </p>
      </div>
    </div>
  )
}

function ProjectListRow(result: Details, index: number) {
  return [
    index === 0 ? <div class="divider" /> : null,
    SingleProject(result),
    <div class="divider" />
  ]
}

export interface ProjectsSearchProps {
  state: State
  actions: Actions
  log: LogFn
}

export function ProjectsSearch(props: ProjectsSearchProps) {
  const { state, actions, log } = props
  return SearchPane({
    state,
    actions,
    log,
    name: "projects",
    resultView: ProjectListRow,
    placeholder: "Search existing projects..."
  })
}
