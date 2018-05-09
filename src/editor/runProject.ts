import { map, getErrorMessage } from "lib/utils"

import { LogFn } from "logger"
import { logEvent } from "analytics"

import * as api from "./api"
import { OUTPUT_TAB_ID } from "./panes"
import { getFile } from "./selectors"
import { compile } from "./compile"

export interface Actions extends api.Actions {
  _setMonacoLoaded()
  _setState(state: Partial<api.State>)
}

export function runProject(
  state: api.State,
  actions: Actions,
  debug: boolean
): Promise<void> {
  if (state.compilationOutput && state.compilationOutput.loading) {
    return
  }
  actions._setState({ compilationOutput: { loading: true, success: false } })
  actions.panes.selectTab(OUTPUT_TAB_ID)
  return compile(state, debug)
    .then(output => {
      if (!output.success) {
        const compiledModules = map(output.modules, (diagnostics, path) => {
          const result: api.CompiledModule = {
            diagnostics,
            path
          }
          return result
        })

        actions._setState({
          compilationOutput: {
            success: false,
            loading: false,
            compiledModules
          }
        })
        throw "Compilation error(s)!"
      }
      const indexHtml = getFile(state, "/index.html")

      if (!indexHtml) {
        throw new Error("No index.html found in files")
      }

      logEvent(debug ? "debug" : "run", {
        event_category: "project",
        event_label: debug ? "DebugProject" : "RunProject"
      })

      const iframeSource = indexHtml.content
        .replace(
          `<script src="/bundle.js"></script>`,
          `<script>if (window.history) { window.history.replaceState(null, null, "/") }</script>
<script>${output.code}</script>`
        )
        .replace(
          `</head>`,
          `<style>body { background-color: white; }</style></head>`
        )

      actions._setState({
        compilationOutput: {
          loading: false,
          success: true,
          iframeSource
        }
      })

      if (debug) {
        actions.debug.showPane(true)
      }
    })
    .catch(e => {
      actions._setState({
        compilationOutput: {
          loading: false,
          success: false,
          error: getErrorMessage(e)
        }
      })
      throw e
    })
}
