import { StringMap } from "lib/utils"

import { SourceNode } from "projects/fileTree"
import { State, FileNotFound } from "./api"
import { AppState, Run } from "./debug/api"

export function isEditable(state: State): boolean {
  return state.status === "editing"
}

export function fileExists(state: State, name: string, parent?: string) {
  // TODO
  return false
}

export function isDirty(source: SourceNode): boolean {
  return source.content !== source.original
}

export function isNotFound(file: any): file is FileNotFound {
  return file.notFound === true
}

export function getPreviewedFile(state: State): SourceNode | null {
  const id = state.ui.previewedFile
  if (!id) {
    return null
  }
  return (state.files.byId[id] as SourceNode) || null
}

function compareRuns(r1: Run, r2: Run): number {
  return r1.timestamp - r2.timestamp
}

export function getRuns(runs: StringMap<Run>): Run[] {
  return Object.keys(runs)
    .map(key => runs[key])
    .sort(compareRuns)
}

export function getSelected(state: State): AppState | null {
  const selected = state.debug.selectedState
  return selected.length > 0 ? selected[0] : null
}

export function isSelected(state: State, appState: AppState): boolean {
  return getSelected(state) === appState
}
