import "monaco-editor"

import { FileTree } from "projects"

import { State } from "../api"
import { getLanguage } from "./languages"
import {
  createModel,
  hasModel,
  deleteAllModels,
  updateModel
} from "./modelStore"

const configureCompiler = (): void => {
  const compilerDefaults: monaco.languages.typescript.CompilerOptions = {
    jsxFactory: "h",
    reactNamespace: "",
    jsx: monaco.languages.typescript.JsxEmit.React,
    target: monaco.languages.typescript.ScriptTarget.ES5,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ES2015,
    experimentalDecorators: true,
    allowJs: true,
    // needed for typescript to "write" the compile content somewhere...
    outDir: "___OUTPUT___",
    sourceMap: true,
    alwaysStrict: true,
    noEmitOnError: false,
    forceConsistentCasingInFileNames: false,
    noImplicitReturns: false,
    noImplicitThis: false,
    noImplicitAny: false,
    strictNullChecks: false,
    noImplicitUseStrict: true,
    suppressImplicitAnyIndexErrors: false,
    noUnusedLocals: false
  }

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerDefaults
  )

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerDefaults
  )
}

function createModelsFor(files: FileTree, override?: boolean): void {
  Object.keys(files.byId).forEach(id => {
    const file = files.byId[id]
    if (file.type === "file") {
      if (!hasModel(file.path)) {
        createModel(file.content, getLanguage(file), file.path)
      } else if (override) {
        updateModel(file.content, file.path)
      }
    }
  })
}

export function configureFor(files: FileTree, newlyOpened: boolean): void {
  if (newlyOpened) {
    configureCompiler()
    deleteAllModels()
  }
  createModelsFor(files, true)
}
