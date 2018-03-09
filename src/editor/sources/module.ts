import { ModuleImpl } from "lib/modules"

import * as api from "./api"

const arr = (sources: string | string[]): string[] =>
  typeof sources === "string" ? [sources] : sources

export const sources: ModuleImpl<api.State, api.Actions> = {
  state: {
    opened: [],
    selected: []
  },
  actions: {
    open: (payload: api.OpenSourcesPayload) => state => {
      const opened = [...state.opened]
      const array = arr(payload.sources)
      const selected = state.selected.filter(
        src => !payload.sources.includes(src)
      )

      array.forEach(source => {
        if (!opened.includes(source)) {
          opened.push(source)
        }

        selected.unshift(source)
      })

      return { opened, selected }
    },
    close: (sources: string | string[]) => state => {
      const array = arr(sources)
      const selected = state.selected.filter(src => !array.includes(src))
      const opened = state.opened.filter(src => !array.includes(src))
      return { opened, selected }
    },
    closeAll: () => {
      return { opened: [], selected: [] }
    },
    select: (source: string) => state => {
      const selected = state.selected.filter(src => src !== source)
      selected.unshift(source)
      return { selected }
    }
  }
}
