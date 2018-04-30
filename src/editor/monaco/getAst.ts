import "monaco-editor"

import { getLanguageService } from "./getLanguageService"

export function getAst(path: string) {
  getLanguageService(path).then(service => {
    // console.log("Getting ast for path " + path)
    // console.log(service)
  })
}
