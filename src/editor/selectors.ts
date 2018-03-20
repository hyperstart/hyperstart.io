import { StringMap } from "lib/utils"

import { SourceNode, FileNode } from "projects/fileTree"
import { DEPENDENCIES_FOLDER, HYPERAPP_NAME } from "projects"

import { State, FileNotFound } from "./api"
import { AppState, Run } from "./debug/api"

export function isEditable(state: State): boolean {
  return state.status === "editing"
}

export function fileExists(
  state: State,
  name: string,
  parent?: string
): boolean {
  const files = state.files.byId
  for (let id in files) {
    const file = files[id]
    if (file.name === name && file.parent == parent) {
      return true
    }
  }

  return false
}

export function isDirty(source: FileNode): boolean {
  return source.type === "file" && source.content !== source.original
}

export function getDirtySources(state: State): string[] {
  const files: any = state.files.byId
  return Object.keys(files).filter(key => isDirty(files[key]))
}

export function hasDirtySources(state: State): boolean {
  const files: any = state.files.byId
  return Object.keys(files).findIndex(key => isDirty(files[key])) >= 0
}

export function isNotFound(file: any): file is FileNotFound {
  return file.notFound === true
}

export function getPreviewedFile(
  state: State
): SourceNode | FileNotFound | null {
  const paths = window.location.pathname.substr(1).split("/")
  if (paths.length < 3) {
    return null
  }

  paths.shift()
  paths.shift()
  const path = paths.join("/")
  const id = state.files.byPath[path]
  if (!id) {
    return { notFound: true, path }
  }

  const result = state.files.byId[id] as SourceNode
  if (!result || result.type !== "file") {
    return { notFound: true, path }
  }

  return result
}

function compareRuns(r1: Run, r2: Run): number {
  return r1.timestamp - r2.timestamp
}

export function getRuns(runs: StringMap<Run>): Run[] {
  return Object.keys(runs)
    .map(key => runs[key])
    .sort(compareRuns)
}

export function getSelectedState(state: State): AppState | null {
  const selected = state.debug.selectedState
  return selected.length > 0 ? selected[0] : null
}

export function isSelected(state: State, appState: AppState): boolean {
  return getSelectedState(state) === appState
}

export function getSelectedSource(state: State): SourceNode | null {
  const selected = state.sources.selected
  if (selected.length === 0) {
    return null
  }
  const id = selected[0]
  return <SourceNode>state.files.byId[id]
}

export function getSource(
  state: State,
  path: string,
  failOnNull: boolean
): SourceNode | null {
  const id = state.files.byPath[path]
  const result = id ? state.files.byId[id] : null
  if (result && result.type === "file") {
    return result
  }
  if (failOnNull) {
    throw new Error(
      "Error while loading source at " +
        path +
        ". Source: " +
        JSON.stringify(result)
    )
  }
  return null
}

export function isDebuggable(state: State): boolean {
  if (!state.files) {
    return false
  }

  const path = DEPENDENCIES_FOLDER + "/" + HYPERAPP_NAME + "/index.js"
  const id = state.files.byPath[path]
  return !!id
}
