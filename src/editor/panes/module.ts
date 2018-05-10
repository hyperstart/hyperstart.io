import { ModuleImpl } from "lib/modules"
import { arr } from "lib/utils"

import { Project } from "projects"

import * as api from "./api"
import { isSinglePane, isSourceTab } from "../selectors"

// # getState

export function createState(project: Project | null): api.State {
  const main = project && project.details.mainPath
  const viewTabs = [api.PROJECT_TAB_ID]
  if (main) {
    viewTabs.push(api.OUTPUT_TAB_ID)
  }
  if (isSinglePane()) {
    if (main) {
      viewTabs.push(main)
    }
    return {
      sources: null,
      views: {
        opened: viewTabs,
        selected: [api.PROJECT_TAB_ID]
      }
    }
  }

  return {
    sources: {
      opened: main ? [main] : [],
      selected: main ? [main] : []
    },
    views: {
      opened: viewTabs,
      selected: [api.PROJECT_TAB_ID]
    }
  }
}

export const panes: ModuleImpl<api.State, api.Actions> = {
  state: createState(null),
  // # Actions
  actions: {
    // ## Common
    selectTab: (tab: string) => state => {
      const type = isSourceTab(tab) && state.sources ? "sources" : "views"
      const pane = state[type]

      const selected = pane.selected.filter(id => id !== tab)
      selected.unshift(tab)

      return {
        [type]: {
          opened: pane.opened,
          selected
        }
      }
    },
    // ## Sources Pane
    openFiles: (files: string | string[]) => state => {
      const type = state.sources ? "sources" : "views"
      const pane = state[type]

      const array = arr(files)
      const selected = pane.selected.filter(id => !array.includes(id))

      const opened = [...pane.opened]
      array.forEach(path => {
        if (!opened.includes(path)) {
          opened.push(path)
        }
        selected.unshift(path)
      })

      return {
        [type]: { selected, opened }
      }
    },
    closeFiles: (files: string | string[]) => state => {
      const type = state.sources ? "sources" : "views"
      const pane = state[type]

      const array = arr(files)

      const selected = pane.selected.filter(path => !array.includes(path))
      const opened = pane.opened.filter(path => !array.includes(path))

      return {
        [type]: { selected, opened }
      }
    },
    // ## Responsive Panes
    onWindowResize: () => state => {
      const singlePane = isSinglePane()
      // !state.sources -> only showing one pane
      if (singlePane === !state.sources) {
        return
      }

      if (singlePane) {
        // switch from 2 panes to 1 pane
        const { sources, views } = state

        return {
          sources: null,
          views: {
            selected: views.selected.concat(sources.selected),
            opened: views.opened.concat(sources.opened)
          }
        }
      } else {
        // switch from 1 pane to 2 panes
        const sources: api.PaneState = {
          opened: [],
          selected: []
        }
        const views: api.PaneState = {
          opened: [],
          selected: []
        }

        state.views.opened.forEach(id => {
          if (isSourceTab(id)) {
            sources.opened.push(id)
          } else {
            views.opened.push(id)
          }
        })

        state.views.selected.forEach(id => {
          if (isSourceTab(id)) {
            sources.selected.push(id)
          } else {
            views.selected.push(id)
          }
        })

        return { sources, views }
      }
    }
  }
}
