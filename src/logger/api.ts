import { ModuleActions } from "api"

// # Log Entry

export type Severity = "loading" | "success" | "info" | "warning" | "error"

export interface LogEntry {
  severity: Severity
  message?: string
  detailedMessage?: string
}

export interface LogEvent {
  event: Promise<any>
  loading?: string
  success?: string
  error?: string
}

export interface LogFn {
  (entry: LogEntry | LogEvent)
}

// # State

export interface State {
  entries: LogEntry[]
  current?: LogEntry
}

// # Actions

export interface Actions extends ModuleActions<State> {
  log(payload: LogEntry | LogEvent)
  clearCurrent(entry?: LogEntry)
}
