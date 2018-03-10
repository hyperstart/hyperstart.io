import { ModuleActions } from "api"

// # Components

export interface SingleResultView {
  (result: any, indexInPage: number, singleResultViewProps?: any): any
}

// # State

export type Status = "not-started" | "running" | "error" | "success"

export interface Search {
  name: string
  query: string
  status: Status
  resultsPerPage: number
  currentPage?: number
  highestPage?: number
  results?: any[]
  hasNext?: boolean
  paneText?: string
  fieldText?: string
  error?: string
  serverError?: string
}

export interface State {
  [name: string]: Search
}

// # Actions

export interface SearchPayload {
  name: string
  type: "field" | "pane"
}

export interface SearchUpdate {
  name: string
  paneText?: string
  fieldText?: string
  query?: string
  status?: Status
  currentPage?: number
  highestPage?: number
  results?: any[]
  hasNext?: boolean
  error?: string
  serverError?: string
}

export interface Actions extends ModuleActions<State> {
  search(payload: SearchPayload): Promise<Search>
  nextPage(name: string): Promise<Search>
  previousPage(name: string)
  update(payload: SearchUpdate)
}
