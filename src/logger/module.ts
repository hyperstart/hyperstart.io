import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export const logger: ModuleImpl<api.State, api.Actions> = {
  state: {
    entries: []
  },
  actions: {
    init: () => {},
    getState: () => state => state,
    log: (entry: api.LogEntry) => state => ({
      current: entry,
      entries: state.entries.push(entry)
    }),
    clearCurrent: (entry?: api.LogEntry) => state => {
      if (entry && entry !== state.current) {
        return
      }
      return { current: null }
    }
  }
}
