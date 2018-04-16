import { StringMap } from "lib/utils"
import { tryParse, checkFirstpass } from "./utils"
import { Resolver } from "../api"

export interface JsModule {
  id: string
  isEsModule: boolean
  isCommonJs: boolean
  hasDefaultExport: boolean
  ast: any
  // map of local import to global imports
  imports: NamedImport[]
}

export interface NamedImport {
  start: number
  end: number
  source: string
  variables: ImportedVariable[]
}

export interface ImportedVariable {
  name: string
  local: string
}

export interface ParseAst {
  (code: string, options: any): any
}

const importExportDeclaration = /^(?:Import|Export(?:Named|Default))Declaration/

function parseModule(parse: ParseAst, code: string, id: string): JsModule {
  const ast = tryParse(parse, code, id)

  let hasDefaultExport = false
  let isEsModule = false
  const imports: NamedImport[] = []
  for (const node of ast.body) {
    const esm = importExportDeclaration.test(node.type)
    if (node.type === "ExportDefaultDeclaration") hasDefaultExport = true
    if (esm) isEsModule = true

    if (esm) {
      if (node.type === "ImportDeclaration" && node.specifiers && node.source) {
        const namedImport: NamedImport = {
          source: node.source.raw,
          start: node.start,
          end: node.end,
          variables: []
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            specifier.imported &&
            specifier.imported.type === "Identifier" &&
            specifier.local &&
            specifier.local.type === "Identifier"
          ) {
            namedImport.variables.push({
              name: specifier.imported.name,
              local: specifier.local.name
            })
          }
        }

        if (namedImport.variables.length > 0) {
          imports.push(namedImport)
        }
      }
    }
  }

  return {
    id,
    ast,
    isEsModule,
    isCommonJs: checkFirstpass(code, false),
    hasDefaultExport,
    imports
  }
}

export interface InternalState {
  /** id -> module */
  modules: StringMap<JsModule>
  /** importer -> importee -> exports[] */
  exports: StringMap<string[]>
}

export interface JsModules {
  /** Called by the resolveId wrapper. */
  computeModule(parse: ParseAst, code: string, id: string): JsModule
  isTransformedCommonJsModule(importer: string, importee: string): boolean
  isTransformedCommonJsModuleById(id: string): boolean
  hasDefaultExports(id: string): boolean
  setRequiredExports(importer: string, importee: string, exports: string[])
  getRequiredExports(id: string): string[]
  get(): InternalState
}

export function createModules(resolver: Resolver): JsModules {
  const state: InternalState = {
    modules: {},
    exports: {}
  }
  return {
    computeModule(parse, code, id) {
      const result = parseModule(parse, code, id)
      state.modules[id] = result
      return result
    },
    isTransformedCommonJsModule(importer, importee) {
      const id = resolver(importee, importer)
      const mod = state.modules[id]
      return mod && mod.isCommonJs
    },
    isTransformedCommonJsModuleById(id) {
      const mod = state.modules[id]
      return mod && mod.isCommonJs
    },
    hasDefaultExports(id) {
      const mod = state.modules[id]
      return mod && mod.hasDefaultExport
    },
    setRequiredExports(importer, importee, requiredExports) {
      state.exports[resolver(importee, importer)] = requiredExports
    },
    getRequiredExports(id) {
      return state.exports[id] || []
    },
    get() {
      return state
    }
  }
}
