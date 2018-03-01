import { ModuleActions } from "api"
import { projects } from "projects"

export namespace editor {
  // # Sources

  export interface SourcesState {
    opened: string[]
    selected: string[]
  }

  export interface SourcesActions {
    open(sources: string | string[], clearOpened?: boolean)
    close(sources: string | string[])
    closeAll()
    select(source: string | null)
  }

  // # Files

  // ## State

  export interface FilesState {
    // TODO
  }

  // ## Actions

  export interface CreateFilePayload {
    type: "file" | "folder"
    name: string
    parent?: projects.File
  }

  export interface SetContentPayload {
    path: string
    content: string
  }

  export interface FilesActions {
    toggleExpanded(path: string)
    create(file: CreateFilePayload): Promise<void>
    delete(file: string | projects.File): Promise<void>
    preview(file: string | projects.File)
    setContent(source: SetContentPayload)
  }

  // # State

  export interface State {
    files: FilesState
    localStore: projects.State
    sources: SourcesState
  }

  // # Actions

  export interface OpenPayload {
    project: projects.Project
    save: boolean
  }

  export interface Actions extends ModuleActions {
    files: FilesActions
    localStore: projects.Actions
    sources: SourcesActions
    open(payload: OpenPayload): Promise<void>
    close()
    submitEdits(): Promise<void>
    setOwner(owner: projects.Owner): Promise<void>
    saveAllSources(): Promise<void>
    run(debug: boolean): Promise<void>
    importProjects(projects: string[]): Promise<void>
  }
}
