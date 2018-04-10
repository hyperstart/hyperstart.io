import { h } from "hyperapp"

import { lazy1, Function1 } from "lib/lazy"
import { getErrorMessage } from "lib/utils"

import { State, Actions } from "../api"
import { CompilationErrors } from "./CompilationErrors"

export interface OutputTabProps {
  state: State
  actions: Actions
}

const _OutputTab = (props: OutputTabProps) => {
  const { state, actions } = props
  if (!state.compilationOutput) {
    actions.run(false)
    return <div class="view-pane-tab output-tab">Loading...</div>
  }

  if (state.compilationOutput.loading) {
    return <div class="view-pane-tab output-tab">Loading...</div>
  }

  if (!state.compilationOutput.success) {
    return (
      <div class="view-pane-tab output-tab">{CompilationErrors(props)}</div>
    )
  }

  const setContent = (iframe: HTMLFrameElement) => {
    try {
      iframe.contentWindow.document.write(state.compilationOutput.iframeSource)
    } catch (e) {
      actions.debug.log({
        level: "error",
        message: getErrorMessage(e)
      })
    }
  }

  return (
    <div class="view-pane-tab output-tab">
      <iframe
        id="preview-iframe"
        oncreate={setContent}
        sandbox="allow-forms allow-pointer-lock allow-popups allow-scripts allow-same-origin"
      />
    </div>
  )
}

export const OutputTab = lazy1.shallow(_OutputTab)
