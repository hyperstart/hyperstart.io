import { getErrorMessage } from "lib/utils"
import { rollup } from "rollup"

import { State } from "../api"
import { CompileOutput } from "./api"
import { commonjs, debug, monaco, resolve, style } from "./plugins"

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
    style(state, result),
    commonjs(state, result)
  ]
  if (debugging) {
    plugins.unshift(debug(state, result))
  }
  return rollup({
    input: state.project.mainFile,
    plugins
  })
    .then(bundle => {
      return bundle.generate({
        format: "iife",
        name: "bundle"
      })
    })
    .then(bundle => {
      // result.success may be set to false by plugins.
      result.code = bundle.code
      return result
    })
}
