import { languages } from "monaco-editor"

import monaco from "./monaco"

declare const require: any

const configure = (
  service: languages.typescript.LanguageServiceDefaults
): void => {
  service.setMaximumWorkerIdleTime(-1)
  service.setEagerModelSync(true)
  service.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  })
}

const onresolve = (resolve: Function) => () => {
  console.log(monaco)
  configure(monaco.languages.typescript.typescriptDefaults)
  configure(monaco.languages.typescript.javascriptDefaults)

  resolve()
}

const onreject = (reject: Function) => (reason: any) => {
  reject(reason)
}

/**
 * Downloads and initialize the monaco editor.
 */
export const initialize = (): Promise<void> =>
  new Promise((resolve, reject) => {
    const loaderScript = document.createElement("script")
    loaderScript.type = "text/javascript"
    loaderScript.src = "https://unpkg.com/monaco-editor@0.12.0/min/vs/loader.js"
    loaderScript.addEventListener("load", () => {
      const req = window["require"]
      req.config({
        paths: { vs: "https://unpkg.com/monaco-editor@0.12.0/min/vs" }
      })

      // proxy instantiation of web workers through a same-domain script
      window["MonacoEnvironment"] = {
        getWorkerUrl: function(workerId, label) {
          return "/monaco-editor-worker-loader-proxy.js"
        }
      }

      req(["vs/editor/editor.main"], onresolve(resolve), onreject(reject))
    })
    document.body.appendChild(loaderScript)
  })
