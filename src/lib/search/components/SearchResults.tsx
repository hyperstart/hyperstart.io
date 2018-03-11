import { h } from "hyperapp"

import { State, Actions, SingleResultView } from "../api"
import { Pagination } from "./Pagination"

import "./SearchResults.scss"
import { LogFn } from "logger"

export interface SearchResultsProps {
  state: State
  actions: Actions
  resultView: SingleResultView
  name: string
  log: LogFn
  aroundResults?: (props, children) => any | string
  singleResultViewProps?: any
  hideTopPagination?: boolean
  hideBottomPagination?: boolean
}

export function SearchResults(props: SearchResultsProps) {
  const {
    state,
    actions,
    name,
    resultView,
    hideBottomPagination,
    hideTopPagination
  } = props
  const data = state[name]
  if (!data || data.status === "not-started") {
    return (
      <div class="empty" style={{ "padding-top": "1rem" }}>
        <h3 class="empty-title">No search done</h3>
      </div>
    )
  }

  if (data.status === "running") {
    return (
      <div class="empty" style={{ "padding-top": "1rem" }}>
        <span>
          <i class="fa fa-spinner fa-pulse fa-2x fa-fw" />
          <span class="sr-only">Loading...</span>
        </span>
      </div>
    )
  }

  const page = data.currentPage
  const pageSize = data.resultsPerPage
  const results = data.results.slice(page * pageSize, (page + 1) * pageSize)

  if (results.length === 0) {
    return (
      <div class="empty" style={{ "padding-top": "1rem" }}>
        <h3 class="empty-title">No results found.</h3>
      </div>
    )
  }

  const Around = props.aroundResults || "div"
  return (
    <div class="search-results">
      <Pagination {...props} hidden={hideTopPagination} />
      <Around>
        {results.map((res, i) =>
          resultView(res, i, props.singleResultViewProps)
        )}
      </Around>
      <Pagination {...props} hidden={hideBottomPagination} />
    </div>
  )
}
