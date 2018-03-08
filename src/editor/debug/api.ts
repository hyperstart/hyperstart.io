import { StringMap } from "lib/utils"

export interface PanelProps {
  // nothing
}

// # State

export interface AppState {
  state: any
  actionData?: any
  actionResult?: any
  previousState?: any
}

export interface AppAction {
  name: string
  states: AppState[]
  collapsed: boolean
}

export interface Run {
  id: string
  timestamp: number
  actions: AppAction[]
  collapsed: boolean
}

export type AppEvent = InitEvent | ActionEvent | RuntimeEvent

export interface InitEvent {
  type: "INITIALIZE"
  id: string
  timestamp: number
  state: any
}

export interface ActionEvent {
  type: "ACTION"
  id: string
  action: string
  data: any
  result: any
}
export interface RuntimeEvent {
  type: "RUNTIME"
  message: any
  level: "info" | "warn" | "error"
}

export interface State {
  runs: StringMap<Run>
  logs: RuntimeEvent[]
  paneShown: boolean
  // only 1 element, this is done to avoid wiring of the state
  selectedState: AppState[]
  collapseRepeatingActions: boolean
  showFullState: boolean
}

// # Actions

export interface ToggleActionPayload {
  run: string
  actionId: number
}

export interface Actions {
  log(event: AppEvent)
  select(state: AppState | null)
  showPane(shown: boolean)
  toggleRun(run: string)
  toggleAction(payload: ToggleActionPayload)
  toggleCollapseRepeatingActions()
  toggleShowFullState()
  deleteRun(id: string)
}
