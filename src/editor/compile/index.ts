import { getErrorMessage } from "lib/utils"

import { State } from "../api"
import { CompileOutput } from "./api"
import { debug, monaco, resolve, style } from "./plugins"

declare const rollup

export const compile = (
  state: State,
  debugging: boolean
): Promise<CompileOutput> => {
  const result: CompileOutput = {
    success: true,
    modules: {}
  }
  const plugins = [
    resolve(state, result),
    monaco(state, result),
    style(state, result)
  ]
  if (debugging) {
    plugins.unshift(debug(state, result))
  }
  return rollup
    .rollup({
      input: state.project.mainFile,
      plugins
    })
    .then(bundle => {
      return bundle.generate({
        format: "iife"
      })
    })
    .then(bundle => {
      // result.success may be set to false by plugins.
      result.code = bundle.code
      return result
    })
}
