import { createFilter } from "rollup-pluginutils"

import {
  Diagnostic as TsDiagnostic,
  DiagnosticMessageChain
} from "lib/typescript"

import { getExtension } from "utils"
import {
  getCompilationOutput,
  getLanguage,
  CompilationOutput
} from "../../monaco"

import { CompileOutput } from "../api"
import { CompilationResult } from "./api"
import { State, Diagnostic } from "../../api"

const SUPPORTED_EXTENSIONS = {
  js: true,
  jsx: true,
  ts: true,
  tsx: true
}

const flatten = (message: string | DiagnosticMessageChain): string => {
  if (typeof message === "string") {
    return message
  }
  // TODO return full stack trace
  return message.messageText
}

const convert = (original: TsDiagnostic): Diagnostic => {
  return {
    category: original.category,
    message: flatten(original.messageText),
    start: original.start,
    length: original.length
  }
}

const collecDiagnostics = (output: CompilationOutput): Diagnostic[] => {
  return [
    ...output.syntacticDiagnostics.map(convert),
    ...output.semanticDiagnostics.map(convert)
  ]
}

export const monaco = (state: State, result: CompileOutput): any => {
  const filter = createFilter()
  return {
    name: "hyperstart-monaco",
    transform(code: string, id: string): Promise<CompilationResult> | null {
      const extension = getExtension(id)
      if (!SUPPORTED_EXTENSIONS[extension] || !filter(id)) {
        return null
      }
      return getCompilationOutput(id, getLanguage(id)).then(output => {
        if (output.emit.emitSkipped) {
          result.success = false
          result.modules[id] = collecDiagnostics(output)
          return { code: "", map: { mappings: "" } }
        }

        let code
        let map
        let dts
        output.emit.outputFiles.forEach(file => {
          // console.log("Got output: ", file)
          if (file.name.endsWith(".js")) {
            code = file.text
          } else if (file.name.endsWith(".map")) {
            map = JSON.parse(file.text)
          } else if (file.name.endsWith(".d.ts")) {
            dts = file.text
          }
        })

        return { code, map, dts }
      })
    }
  }
}
