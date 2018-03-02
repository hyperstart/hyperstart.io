import { ModuleActions } from "api"

// # Log Entry

export enum Severity {
  LOADING,
  SUCCESS,
  INFO,
  WARNING,
  ERROR
}

export interface LogEntry {
  lseverity: Severity
  message?: string
  detailedMessage?: string
}

// # State

export interface State {
  entries: LogEntry[]
  current?: LogEntry
}

// # Actions

export interface Actions extends ModuleActions<State> {
  log(entry: LogEntry): void
  clearCurrent(entry?: LogEntry): void
}
