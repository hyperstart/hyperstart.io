import { transform } from "buble"
import { createFilter } from "rollup-pluginutils"

import { getExtension } from "utils"

import { State } from "../../api"
import { CompileOutput } from "../api"

const SUPPORTED_EXTENSIONS = {
  js: true,
  jsx: true
}

export function buble(state: State, result: CompileOutput): any {
  var filter = createFilter()

  // TODO this seem to affect the debugger somehow.

  return {
    name: "hyperstart-buble",

    transform: function(code, id) {
      const extension = getExtension(id)
      if (!SUPPORTED_EXTENSIONS[extension] || !filter(id)) {
        return null
      }

      try {
        return transform(code, {
          jsx: "h",
          transforms: {
            dangerousForOf: true,
            dangerousTaggedTemplateString: true,
            modules: false
          }
        })
      } catch (e) {
        e.plugin = "hyperstart-buble"
        if (!e.loc) e.loc = {}
        e.loc.file = id
        e.frame = e.snippet
        throw e
      }
    }
  }
}
