import { map, getErrorMessage } from "lib/utils"

import { SourceNode } from "projects"

import * as api from "./api"
import { OUTPUT_TAB_ID } from "./constants"
import { compile } from "./compile"
import { LogFn } from "logger"

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
  actions.ui.selectViewPaneTab(OUTPUT_TAB_ID)
  return actions
    .saveAllSources()
    .then(() => {
      state = actions.getState()
      return compile(state, debug)
    })
    .then(output => {
      if (!output.success) {
        const compiledModules = map(output.modules, (diagnostics, path) => {
          const result: api.CompiledModule = {
            diagnostics,
            fileId: state.files.byPath[path]
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
      const indexHtmlId = state.files.byPath["index.html"]
      const indexHtml = state.files.byId[indexHtmlId] as SourceNode

      if (!indexHtmlId || !indexHtml) {
        throw new Error("No index.html found in files")
      }

      const iframeSource = indexHtml.content.replace(
        `<script src="/bundle.js"></script>`,
        `<script>if (window.history) { window.history.replaceState(null, null, "/") }</script>
<script>${output.code}</script>`
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
