import { ModuleImpl } from "lib/modules"

import * as api from "./api"

// internal actions
interface Actions extends api.Actions {
  _log(entry: api.LogEntry)
}

function isLogEntry(entry: any): entry is api.LogEntry {
  const s = entry.severity
  return (
    s === "loading" ||
    s === "success" ||
    s === "info" ||
    s === "warning" ||
    s === "error"
  )
}

const _logger: ModuleImpl<api.State, Actions> = {
  state: {
    entries: []
  },
  actions: {
    init: () => {},
    getState: () => state => state,
    _log: (entry: api.LogEntry) => state => ({
      current: entry,
      entries: state.entries.push(entry)
    }),
    log: (payload: api.LogEntry | api.LogEvent) => (_, actions) => {
      if (!payload) {
        return
      }

      if (isLogEntry(payload)) {
        actions._log(payload)
        return
      }

      actions._log({ severity: "loading", message: payload.loading })
      payload.event
        .then(() => {
          actions._log({ severity: "success", message: payload.success })
        })
        .catch(e => {
          actions._log({ severity: "error", message: payload.error })
          throw e
        })
    },
    clearCurrent: (entry?: api.LogEntry) => state => {
      if (entry && entry !== state.current) {
        return
      }
      return { current: null }
    }
  }
}
export const logger: ModuleImpl<api.State, api.Actions> = _logger
