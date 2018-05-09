// # State

export const PROJECT_TAB_ID = "Project"
export const OUTPUT_TAB_ID = "Output"

export interface PaneState {
  opened: string[]
  selected: string[]
}

export interface State {
  sources: PaneState | null
  views: PaneState
}

// # Actions

export interface Actions {
  // ## Common
  selectTab(tab: string)
  // ## Sources Pane
  openFiles(sources: string | string[])
  closeFiles(sources: string | string[])
  // ## Responsive Panes
  onWindowResize()
}
