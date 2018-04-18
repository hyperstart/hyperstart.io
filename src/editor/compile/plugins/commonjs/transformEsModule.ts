import MagicString, { SourceMap } from "magic-string"

import { NamedImport, JsModules, JsModule } from "./modules"
import { makeLegalIdentifier, ModuleSource } from "./utils"

function buildCommonJsImport(namedImport: NamedImport): string {
  const defaultIdentifier = makeLegalIdentifier(namedImport.source)

  return `import ${defaultIdentifier} from ${namedImport.source};
${namedImport.variables
    .map(
      variable =>
        `var ${variable.local} = ${defaultIdentifier}.${variable.name};`
    )
    .join("\n")}`
}

export function transformEsModule(
  parse,
  inCode: string,
  modules: JsModules,
  jsModule: JsModule
): ModuleSource | string {
  const id = jsModule.id
  const magicString = new MagicString(inCode)

  // sort by position desc to make sure we can just replace
  let replaced = false
  jsModule.imports
    .sort((i1, i2) => i2.start - i1.start)
    .forEach(namedImport => {
      const source = namedImport.source
      const importee = source.slice(1, source.length - 1)

      if (modules.isTransformedCommonJsModule(id, importee)) {
        // the module is already transformed, AND a commonjs module
        // change all the named imports to a global import + variable declaration
        magicString.overwrite(
          namedImport.start,
          namedImport.end,
          buildCommonJsImport(namedImport)
        )
        replaced = true
      } else {
        // register the required exports, if the module turns out to be a commonjs module, it will export these.
        modules.setRequiredExports(
          id,
          importee,
          namedImport.variables.map(v => v.name)
        )
      }
    })
  // no need to generate anything if no import replaced.
  if (!replaced) {
    return inCode
  }

  const code = magicString.toString()
  const map = magicString.generateMap()

  return { code, map }
}
