import { h } from "hyperapp"

import { State, Actions, SingleResultView } from "./api"
import { TextField, SearchResults } from "./components"

export interface SearchPaneProps {
  state: State
  actions: Actions
  resultView: SingleResultView
  /** Defaults to "default" */
  name?: string
  placeholder?: string
  aroundResults?: () => any | string
  singleResultViewProps?: any
}

export function SearchPane(props: SearchPaneProps) {
  return (
    <div>
      <TextField {...props} type="pane" displaySearchButton />
      <SearchResults {...props} />
    </div>
  )
}
