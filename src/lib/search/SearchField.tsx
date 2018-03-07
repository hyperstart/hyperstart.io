import { h } from "hyperapp"

import { State, Actions, SingleResultView } from "./api"
import { TextField, SearchResults } from "./components"

export interface SearchFieldProps {
  state: State
  actions: Actions
  name: string
  placeholder?: string
}

export function SearchField(props: SearchFieldProps) {
  return (
    <div>
      <TextField {...props} type="field" displaySearchButton />
    </div>
  )
}
