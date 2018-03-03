import { h } from "hyperapp"

import { State, Actions } from "../api"

export interface PaginationProps {
  state: State
  actions: Actions
  name?: string
  hidden?: boolean
}

export function Pagination(props: PaginationProps) {
  const { state, actions, name = "default", hidden } = props
  const search = state[name]
  const page = search.currentPage
  const prevDisabled = page === 0
  const nextDisabled = !search.hasNext

  if (hidden) {
    return <div />
  }

  return (
    <ul class="pagination" style={{ "align-self": "flex-end" }}>
      <li class={"page-item" + (prevDisabled ? " disabled" : "")}>
        <button
          class="btn btn-link"
          disabled={prevDisabled}
          onclick={e => {
            actions.previousPage(name)
            window.scroll(0, 0)
            e.preventDefault()
          }}
        >
          Previous
        </button>
      </li>
      <li class="divider-vert" />
      <li class={"page-item" + (nextDisabled ? " disabled" : "")}>
        <button
          class="btn btn-link"
          disabled={nextDisabled}
          onclick={e => {
            actions.nextPage(name)
            window.scroll(0, 0)
            e.preventDefault()
          }}
        >
          Next
        </button>
      </li>
    </ul>
  )
}
