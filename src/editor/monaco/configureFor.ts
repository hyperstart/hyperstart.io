import "monaco-editor"

import { Files } from "projects"

import { State } from "../api"
import { getLanguage } from "./languages"
import {
  createModel,
  hasModel,
  deleteAllModels,
  updateModel
} from "./modelStore"
import { inferMainFile, PackageJson } from "lib/npm"
import { StringMap } from "lib/utils"

let a: monaco.languages.typescript.CompilerOptions

type Paths = StringMap<string[]>

let oldPaths

function oldPathHasMapping(name: string, path: string): boolean {
  return oldPaths && oldPaths[name] && oldPaths[name][0] === path
}

function getPathsIfDifferent(files: Files, force: boolean): Paths {
  const paths: Paths = {}
  let equals = true
  Object.keys(files).forEach(path => {
    if (!path.endsWith("/package.json")) {
      return
    }

    const file = files[path]
    const json: PackageJson = JSON.parse(file.content)
    const main = inferMainFile(json)
    const resolved = path
      .replace("package.json", main)
      .replace(".js", "")
      .substring(1)
    const name = json.name

    if (!force && !oldPathHasMapping(name, resolved)) {
      equals = false
    }

    paths[name] = [resolved]
  })

  if (!force && equals) {
    return null
  }

  return paths
}

function configureCompiler(files: Files, force: boolean): void {
  const paths = getPathsIfDifferent(files, force)
  if (!paths) {
    // no need to set the compiler options if the paths haven't changed
    return
  }

  oldPaths = paths

  const compilerDefaults /*: monaco.languages.typescript.CompilerOptions*/ = {
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
    noUnusedLocals: false,
    baseUrl: "/",
    paths
  }

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
    compilerDefaults as any
  )

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
    compilerDefaults as any
  )
}

function createModelsFor(files: Files, override?: boolean): void {
  Object.keys(files).forEach(path => {
    const file = files[path]
    if (!hasModel(path)) {
      createModel(file.content, getLanguage(path), path)
    } else if (override) {
      updateModel(file.content, path)
    }
  })
}

export function configureFor(files: Files, newlyOpened: boolean): void {
  configureCompiler(files, newlyOpened)

  if (newlyOpened) {
    deleteAllModels()
  }

  createModelsFor(files, true)
}
