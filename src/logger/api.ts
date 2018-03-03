import { ModuleActions } from "api"

// # Log Entry

export type Severity = "loading" | "success" | "info" | "warning" | "error"

export interface LogEntry {
  severity: Severity
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
