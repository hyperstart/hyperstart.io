import { h } from "hyperapp"

import { State, Actions, Search, SingleResultView } from "./api"
import { TextField, SearchResults } from "./components"
import { LogFn } from "logger"

export interface SearchFieldProps {
  state: State
  actions: Actions
  name: string
  log: LogFn
  onSearch?: (search: Search) => void
  placeholder?: string
  displaySearchButton?: boolean
}

export function SearchField(props: SearchFieldProps) {
  return (
    <div>
      <TextField {...props} type="field" />
    </div>
  )
}
