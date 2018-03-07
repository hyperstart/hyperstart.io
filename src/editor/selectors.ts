import { SourceNode } from "projects/fileTree"
import { State } from "./api"

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
