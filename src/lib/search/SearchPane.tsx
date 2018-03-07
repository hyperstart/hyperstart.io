import { h } from "hyperapp"

import { State, Actions, SingleResultView } from "./api"
import { TextField, SearchResults } from "./components"

export interface SearchPaneProps {
  state: State
  actions: Actions
  name: string
  resultView: SingleResultView
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
