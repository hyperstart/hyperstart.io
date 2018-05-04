import { h } from "hyperapp"

import { MonacoEditor, getModel, getEditor } from "../monaco"
import { State, Actions } from "../api"

export interface SourceEditorProps {
  state: State
  actions: Actions
  source: string
}
// monaco.editor.IEditorOptions
function getOptions(): any {
  return {
    minimap: { enabled: false },
    folding: true,
    fixedOverflowWidgets: true,
    wordWrap: "on",
    wrappingIndent: "same",
    theme: "vs-dark"
  }
}

export function SourceEditor(props: SourceEditorProps) {
  const { state, actions, source } = props

  function onModelContentChanged(editor: monaco.editor.IEditor) {
    const model = editor.getModel() as monaco.editor.IModel
    actions.setFileContent({
      path: model.uri.path,
      content: model.getValue()
    })
  }

  function getOverrides(e: HTMLElement) {
    return {
      editorService: {
        openEditor: function(input, sideBySide): Promise<any> {
          const path = input.resource.path
          actions.openFiles(path)
          if (input.options && input.options.selection) {
            getEditor(e).setModel(getModel(path))
            getEditor(e).revealRangeAtTop(input.options.selection)
          }

          return Promise.resolve({ getControl: () => getEditor(e) })
        }
      },
      textModelService: {
        createModelReference(uri: monaco.Uri): Promise<any> {
          const model = {
            load() {
              return Promise.resolve(model)
            },
            dispose() {},
            textEditorModel: getModel(uri.path)
          }

          return Promise.resolve({
            object: model,
            dispose() {}
          })
        }
      }
    }
  }

  const model = source ? getModel(source) : undefined
  return MonacoEditor({
    getOptions,
    getOverrides,
    model,
    onModelContentChanged
  })
}
