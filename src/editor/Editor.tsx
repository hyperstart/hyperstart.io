import { h } from "hyperapp"

import { SplitPane } from "lib/components"
import { addInterceptor, removeInterceptor } from "lib/router"

import { getEditorUrl } from "utils"
import { User } from "users"

import { DebugPane, SourcesPane, ViewsPane } from "./components"
import { hasDirtySources } from "./selectors"
import { State, Actions } from "./api"
import { LogFn } from "logger"

export interface EditorProps {
  state: State
  actions: Actions
  currentUser: User | null
  log: LogFn
  loading: boolean
}

const INTERCEPTOR = "__INTERCEPTOR"
const IFRAME_LISTENER = "__IFRAME_LISTENER"
const UNLOAD = "__UNLOAD"

export function Editor(props: EditorProps) {
  const { state, actions } = props

  if (!state.project) {
    return <div />
  }

  const oncreate = (e: HTMLElement) => {
    e[INTERCEPTOR] = (url: string) => {
      if (
        !url.includes(getEditorUrl(state.project)) &&
        hasDirtySources(state)
      ) {
        return confirm(
          "This project has unsaved changes, are you sure you want to leave this page?"
        )
      }
      return true
    }
    addInterceptor(e[INTERCEPTOR])

    e[UNLOAD] = (e: BeforeUnloadEvent) => {
      if (hasDirtySources(state)) {
        e.returnValue =
          "This project has unsaved changes, are you sure you want to leave this page?"
      }
    }
    window.addEventListener("beforeunload", e[UNLOAD])

    e[IFRAME_LISTENER] = (e: MessageEvent) => {
      const iframe = document.getElementById(
        "preview-iframe"
      ) as HTMLIFrameElement
      if (
        iframe &&
        e.origin === window.location.origin &&
        iframe.contentWindow === e.source &&
        typeof e.data === "string"
      ) {
        const data = JSON.parse(e.data)
        data.timestamp = new Date().getTime()

        switch (data.type) {
          case "INITIALIZE":
            actions.debug.logInit({
              runId: data.id,
              state: data.state,
              timestamp: new Date().getTime()
            })
            break
          case "ACTION_START":
            actions.debug.logAction({
              runId: data.id,
              callDone: false,
              action: data.action,
              data: data.data
            })
            break
          case "ACTION_DONE":
            actions.debug.logAction({
              runId: data.id,
              callDone: true,
              action: data.action,
              result: data.result
            })
            break
        }
      }
    }
    window.addEventListener("message", e[IFRAME_LISTENER])
  }

  const ondestroy = (e: HTMLElement) => {
    actions.close()
    removeInterceptor(e[INTERCEPTOR])
    window.removeEventListener("beforeunload", e[UNLOAD])
    window.removeEventListener("message", e[IFRAME_LISTENER])
  }

  return (
    <SplitPane
      key="project-editor-div"
      oncreate={oncreate}
      ondestroy={ondestroy}
    >
      {state.debug.paneShown ? DebugPane(props) : SourcesPane(props)}
      {ViewsPane(props)}
    </SplitPane>
  )
}
