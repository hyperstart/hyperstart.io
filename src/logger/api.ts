import { ModuleActions } from "api"

// # Log Entry

export type Severity = "loading" | "success" | "info" | "warning" | "error"

export interface LogEntry {
  severity: Severity
  message?: string
  detailedMessage?: string
}

export interface LogEvent {
  promise: Promise<any>
  loading?: string
  success?: string | ((result: any) => string)
  error?: string | ((result: any) => string)
}

export interface LogFn {
  (entry: LogEntry | LogEvent | Promise<any>)
}

// # State

export interface State {
  entries: LogEntry[]
  current?: LogEntry
}

// # Actions

export type LogPayloadObject = LogEntry | LogEvent | Promise<any>

export type LogPayload = LogPayloadObject | (() => LogPayloadObject)

export interface Actions extends ModuleActions<State> {
  /** Returns the promise for LogEvent. */
  log(payload: LogPayload): any
  clearCurrent(entry?: LogEntry)
}
