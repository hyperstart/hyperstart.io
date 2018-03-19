import { ModuleImpl } from "lib/modules"

import * as api from "./api"
import { getErrorMessage } from "lib/utils"

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

function getEvent(payload: api.LogEvent | Promise<any>): api.LogEvent {
  if (payload instanceof Promise) {
    return {
      promise: payload,
      success: "Action successful",
      error: e => `Error: ${getErrorMessage(e)}`
    }
  }

  return payload
}

const _logger: ModuleImpl<api.State, Actions> = {
  state: {
    entries: []
  },
  actions: {
    init: () => {},
    getState: () => state => state,
    _log: (entry: api.LogEntry) => state => {
      // TODO clear after 2 seconds
      return {
        current: entry,
        entries: state.entries.concat(entry)
      }
    },
    log: (payload: api.LogPayload) => (_, actions) => {
      if (!payload) {
        return
      }

      if (typeof payload === "function") {
        payload = payload()
      }

      if (isLogEntry(payload)) {
        actions._log(payload)
        return
      }

      const event = getEvent(payload)

      actions._log({ severity: "loading", message: event.loading })
      return event.promise
        .then(res => {
          const message =
            typeof event.success === "function"
              ? event.success(res)
              : event.success
          actions._log({ severity: "success", message })
          return res
        })
        .catch(e => {
          const message =
            typeof event.error === "function" ? event.error(e) : event.error
          actions._log({ severity: "error", message })
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
