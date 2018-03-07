import { h } from "hyperapp"

import { SplitPane } from "lib/components"
import { addInterceptor, removeInterceptor } from "lib/router"

import { State, Actions } from "./api"

import "./Editor.scss"

export interface EditorProps {
  state: State
  actions: Actions
}

export function Editor(props: EditorProps) {
  // TODO
}

// import { DebugPane, SourcesPane, ViewsPane } from "./components"
// import { ViewProps, WiredProps } from "./types"
// import { getEditorUrl } from "utils"

// const INTERCEPTOR = "__INTERCEPTOR"
// const IFRAME_LISTENER = "__IFRAME_LISTENER"
// const UNLOAD = "__UNLOAD"

// export const View = (props: ViewProps & WiredProps) => {
//   const { app } = props
//   if (!app.artifact) {
//     return <div />
//   }

//   const oncreate = (e: HTMLElement) => {
//     e[INTERCEPTOR] = (url: string) => {
//       if (
//         !url.includes(getEditorUrl(app.artifact.details)) &&
//         app.hasDirtySources()
//       ) {
//         return confirm(
//           "This project has unsaved changes, are you sure you want to leave this page?"
//         )
//       }
//       return true
//     }
//     addInterceptor(e[INTERCEPTOR])

//     e[UNLOAD] = (e: BeforeUnloadEvent) => {
//       if (app.hasDirtySources()) {
//         e.returnValue =
//           "This project has unsaved changes, are you sure you want to leave this page?"
//       }
//     }
//     window.addEventListener("beforeunload", e[UNLOAD])

//     e[IFRAME_LISTENER] = (e: MessageEvent) => {
//       const iframe = document.getElementById(
//         "preview-iframe"
//       ) as HTMLIFrameElement
//       if (
//         iframe &&
//         e.origin === window.location.origin &&
//         iframe.contentWindow === e.source &&
//         typeof e.data === "string"
//       ) {
//         const data = JSON.parse(e.data)
//         data.timestamp = new Date().getTime()
//         app.debug.log(data)
//       }
//     }
//     window.addEventListener("message", e[IFRAME_LISTENER])
//   }

//   const ondestroy = (e: HTMLElement) => {
//     app.close()
//     removeInterceptor(e[INTERCEPTOR])
//     window.removeEventListener("beforeunload", e[UNLOAD])
//     window.removeEventListener("message", e[IFRAME_LISTENER])
//   }

//   return (
//     <SplitPane
//       key="artifact-editor-div"
//       oncreate={oncreate}
//       ondestroy={ondestroy}
//     >
//       {app.debug.paneShown ? DebugPane(props) : SourcesPane(props)}
//       {ViewsPane(props)}
//     </SplitPane>
//   )
// }
