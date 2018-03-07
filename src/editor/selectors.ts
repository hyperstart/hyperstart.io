import { SourceNode } from "projects/fileTree"
import { State, FileNotFound } from "./api"

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
