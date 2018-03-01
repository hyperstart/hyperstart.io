export namespace logger {
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

  export interface Actions {
    log(entry: LogEntry): void
    clearCurrent(entry?: LogEntry): void
  }
}
