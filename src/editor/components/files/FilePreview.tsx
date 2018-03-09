import { h } from "hyperapp"

import { SourceNode } from "projects/fileTree"
import { getExtension, getEditorUrl } from "utils"

import { State, Actions, FileNotFound } from "../../api"
import { MonacoEditor, getModel } from "../../monaco"
import { render, postRender } from "./markdown"
import { isNotFound } from "../../selectors"

export interface PreviewProps {
  actions: Actions
  file: SourceNode
}

const SourcePreview = (props: PreviewProps) => {
  const { file } = props
  const model = getModel(file.path)

  return <MonacoEditor getOptions={getOptions} model={model} />
}

const MarkdownPreview = (props: PreviewProps) => {
  const { actions, file } = props

  const oncreate = (e: HTMLElement) => {
    e.innerHTML = render(file.content)
    e["_CONTENT"] = file.content
    postRender(e, actions)
  }

  const onupdate = (e: HTMLElement) => {
    if (e["_CONTENT"] !== file.content) {
      e.innerHTML = render(file.content)
      postRender(e, actions)
      e["_CONTENT"] = file.content
    }
  }

  return (
    <div class="markdown-preview">
      <div
        key={"preview-source-" + file.id}
        oncreate={oncreate}
        onupdate={onupdate}
      />
    </div>
  )
}

const Preview = (props: PreviewProps) => {
  const { file } = props
  if (getExtension(file.name) === "md") {
    return MarkdownPreview(props)
  }

  return SourcePreview(props)
}

const getOptions = (): monaco.editor.IEditorOptions => {
  return {
    minimap: { enabled: false },
    folding: true,
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: true,
    wordWrap: "on",
    wrappingIndent: "same",
    readOnly: true
  }
}

export interface FilePreviewProps {
  state: State
  actions: Actions
  file: SourceNode | FileNotFound
}

export const FilePreview = (props: FilePreviewProps) => {
  const { actions, file } = props

  const onclose = (e: Event) => {
    actions.previewFile(null)
  }

  if (isNotFound(file)) {
    return (
      <div class="file-window">
        <h3>File not found!</h3>
        No file at path {file.path}!
        <a href="#" onclick={onclose}>
          Close Preview.
        </a>
      </div>
    )
  }

  return (
    <div class="file-window">
      <div class="title-bar">
        <span>Preview of {file.path}</span>
        <button
          class="btn btn-clear"
          aria-label="Close"
          role="button"
          onclick={onclose}
        />
      </div>
      {Preview({ actions, file })}
    </div>
  )
}
