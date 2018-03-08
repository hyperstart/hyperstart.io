import { h } from "hyperapp"

import { SourceNode } from "projects/FileTree"

import { MonacoEditor, getModel } from "../monaco"
import { State, Actions } from "../api"

export interface SourceEditorProps {
  state: State
  actions: Actions
  source: SourceNode
}
// monaco.editor.IEditorOptions
function getOptions(): any {
  return {
    minimap: { enabled: false },
    folding: true,
    fixedOverflowWidgets: true,
    wordWrap: "on",
    wrappingIndent: "same"
    // theme: "vs-dark"
  }
}

export function SourceEditor(props: SourceEditorProps) {
  const { state, actions, source } = props

  function onModelContentChanged(editor: monaco.editor.IEditor) {
    const model = editor.getModel() as monaco.editor.IModel
    actions.files.setContent({
      path: model.uri.path,
      content: model.getValue()
    })
  }

  const model = source ? getModel(source.path) : undefined
  return MonacoEditor({ getOptions, model, onModelContentChanged })
}