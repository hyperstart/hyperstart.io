import { h } from "hyperapp"

import { State, Actions, SingleResultView } from "./api"
import { TextField, SearchResults } from "./components"
import { LogFn } from "logger"

export interface SearchPaneProps {
  state: State
  actions: Actions
  name: string
  resultView: SingleResultView
  log: LogFn
  placeholder?: string
  aroundResults?: () => any | string
  singleResultViewProps?: any
}

export function SearchPane(props: SearchPaneProps) {
  return (
    <div class="search-pane">
      <TextField {...props} type="pane" displaySearchButton />
      <SearchResults {...props} />
    </div>
  )
}
