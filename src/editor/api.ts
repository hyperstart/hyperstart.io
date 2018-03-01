import { ModuleActions } from "api"
import { projects } from "projects"

export namespace editor {
  // # Sources

  export interface SourcesState {
    opened: string[]
    selected: string[]
  }

  export interface SourcesActions {
    open(sources: string | string[], clearOpened?: boolean): void
    close(sources: string | string[]): void
    closeAll(): void
    select(source: string | null): void
  }

  // # State

  export interface State {
    localStore: projects.State
    sources: SourcesState
  }

  // # Actions

  export interface Actions extends ModuleActions {
    localStore: projects.Actions
    sources: SourcesActions
    open(project: projects.Project)
  }
}
