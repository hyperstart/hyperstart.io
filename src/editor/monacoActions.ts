import { MonacoAction } from "./api"

let currentSourceEditor: monaco.editor.ICodeEditor

export function setCurrentSourceEditor(editor: monaco.editor.ICodeEditor) {
  currentSourceEditor = editor
}

export function hasCurrentEditor(): boolean {
  return !!currentSourceEditor
}

export function executeAction(action: MonacoAction): Promise<void> {
  if (!hasCurrentEditor()) {
    throw new Error("No monaco editor currently active")
  }

  return new Promise((resolve, reject) => {
    currentSourceEditor
      .getAction(action)
      .run()
      .then(() => resolve(), err => reject(err))
  })
}
