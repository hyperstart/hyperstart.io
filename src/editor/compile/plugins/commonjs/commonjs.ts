import { State } from "../../../api"
import { CompileOutput } from "../../api"
import { HELPERS_ID, HELPERS, PREFIX } from "./helpers"
import { getName } from "./utils"
import { JsModules, createModules } from "./modules"
import { transformCommonjsModule } from "./transformCommonJsModule"
import { transformEsModule } from "./transformEsModule"
import { Resolver } from "../api"

function first(candidates: Resolver[]): Resolver {
  return function(importee, importer) {
    for (const candidate of candidates) {
      const result = candidate(importee, importer)
      if (result) {
        return result
      }
    }
  }
}

function startsWith(str: string, prefix: string): boolean {
  return str.slice(0, prefix.length) === prefix
}

function failingResolver(importee, importer) {
  if (!importer) {
    throw new Error("Cannot resolve entry file " + importee)
  }
  throw new Error("Cannot resolve import " + importee + " in file " + importer)
}

export function commonjs(state: State, result: CompileOutput): any {
  let resolve: Resolver
  let modules: JsModules

  const name = "hyperstart-commonjs"
  return {
    name,
    options(options) {
      const resolvers = []
      // get a resolve function that uses other functions
      options.plugins.forEach(plugin => {
        if (typeof plugin.resolveId === "function" && plugin.name !== name) {
          resolvers.push(plugin.resolveId)
        }
      })

      resolvers.push(failingResolver)
      resolve = first(resolvers)
      modules = createModules(resolve)
    },
    resolveId(importee, importer) {
      if (importee === HELPERS_ID) {
        return importee
      }

      if (importer && startsWith(importer, PREFIX)) {
        importer = importer.slice(PREFIX.length)
      }

      const isProxyModule = startsWith(importee, PREFIX)
      if (isProxyModule) {
        importee = importee.slice(PREFIX.length)
      }

      // use default resolution
      const id = resolve(importee, importer)
      return isProxyModule ? PREFIX + id : id
    },
    load(id: string) {
      if (id === HELPERS_ID) {
        return HELPERS
      }

      if (startsWith(id, PREFIX)) {
        // add an extra "/" to turn this into a global path, the resolve plugin will take care of the rest
        const actualId = id.slice(PREFIX.length)
        const actualPath = actualId
        const name = getName(actualId)

        let result
        if (modules.isTransformedCommonJsModuleById(actualId)) {
          result = `import { __moduleExports } from ${JSON.stringify(
            actualPath
          )}; export default __moduleExports;`
        } else if (modules.hasDefaultExports(actualId)) {
          result = `import * as ${name} from ${JSON.stringify(
            actualPath
          )}; export default ${name};`
        } else {
          result = `import * as ${name} from ${JSON.stringify(
            actualPath
          )}; export default ( ${name} && ${name}['default'] ) || ${name};`
        }

        return result
      }
    },
    transform(code, id) {
      if (id === HELPERS_ID) {
        return code
      }

      try {
        const jsModule = modules.computeModule(this.parse, code, id)

        if (jsModule.isEsModule) {
          if (startsWith(id, PREFIX)) {
            return code
          }
          const result = transformEsModule(this.parse, code, modules, jsModule)

          return result
        } else if (!jsModule.isCommonJs) {
          // it is not an ES module but not a commonjs module, too, do nothing.
          return code
        }

        // it's a commonjs module
        const transformed = transformCommonjsModule(
          this.parse,
          code,
          id,
          false, // isEntry
          false, // ignoreGlobals
          () => false, // ignoreRequire
          true, // sourceMap
          false, // allowDynamicRequire
          modules,
          jsModule,
          modules.getRequiredExports(id)
        )

        return transformed
      } catch (e) {
        console.error(e)
      }
    }
  }
}
