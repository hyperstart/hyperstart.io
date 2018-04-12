import { editor } from "monaco-editor"

import monaco from "./monaco"

interface Models {
  [path: string]: editor.IModel
}

const models: Models = {}

export const createModel = (code: string, language: string, path: string) => {
  if (models[path]) {
    throw new Error("Model already exists for path " + path)
  }
  const result = monaco.editor.createModel(
    code,
    language,
    monaco.Uri.from({ path })
  )

  result.updateOptions({
    tabSize: 2,
    insertSpaces: true,
    trimAutoWhitespace: true
  })

  models[path] = result
  return result
}

export const hasModel = (path: string) => {
  return !!models[path]
}

export const getModel = (path: string) => {
  if (!models[path]) {
    throw new Error("No model found at path " + path)
  }
  return models[path]
}

const arr = (paths: string | string[]): string[] =>
  typeof paths === "string" ? [paths] : paths

export const deleteModels = (paths: string | string[]) => {
  arr(paths).forEach(path => {
    const model = models[path]
    if (!model) {
      throw new Error("No model found at path " + path)
    }
    model.dispose()
    delete models[path]
  })
}

export const deleteAllModels = () => {
  Object.keys(models).forEach(key => {
    models[key].dispose()
    delete models[key]
  })
}
