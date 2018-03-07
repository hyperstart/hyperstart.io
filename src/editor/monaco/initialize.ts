declare const require: any

const configure = (
  service: monaco.languages.typescript.LanguageServiceDefaults
): void => {
  service.setMaximunWorkerIdleTime(-1)
  service.setEagerModelSync(true)
  service.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false
  })
}

const onresolve = (resolve: Function) => () => {
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
    loaderScript.src = "https://unpkg.com/monaco-editor@0.10.1/min/vs/loader.js"
    loaderScript.addEventListener("load", () => {
      const req = window["require"]
      req.config({
        paths: { vs: "https://unpkg.com/monaco-editor@0.10.1/min/vs" }
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
