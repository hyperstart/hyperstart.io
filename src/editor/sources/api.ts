// # State

export interface State {
  opened: string[]
  selected: string[]
}

// # Actions

export interface OpenSourcesPayload {
  sources: string | string[]
  clearOpened?: boolean
}

export interface Actions {
  open(payload: OpenSourcesPayload)
  close(sources: string | string[])
  closeAll()
  select(source: string | null)
}
