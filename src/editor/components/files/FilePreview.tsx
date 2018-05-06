import { h } from "hyperapp"

import { getExtension, getEditorUrl } from "utils"
import { File } from "projects"

import { State, Actions, FileNotFound, FileNode } from "../../api"
import { MonacoEditor, getModel } from "../../monaco"
import { render, postRender } from "./markdown"

import "./FilePreview.scss"
import { isNotFound } from "../../selectors"

export interface PreviewProps {
  state: State
  actions: Actions
  file: FileNode
}

const SourcePreview = (props: PreviewProps) => {
  const { file } = props
  const model = getModel(file.path)

  return <MonacoEditor getOptions={getOptions} model={model} />
}

const MarkdownPreview = (props: PreviewProps) => {
  const { state, actions, file } = props

  const content = state.project.files[file.path].content

  const oncreate = (e: HTMLElement) => {
    e.innerHTML = render(content)
    e["_CONTENT"] = content
    postRender(e, actions)
  }

  const onupdate = (e: HTMLElement) => {
    if (e["_CONTENT"] !== content) {
      e.innerHTML = render(content)
      postRender(e, actions)
      e["_CONTENT"] = content
    }
  }

  return (
    <div
      key={"preview-source-" + file.path}
      oncreate={oncreate}
      onupdate={onupdate}
      class="markdown-preview"
    />
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
  file: FileNode | FileNotFound
}

export const FilePreview = (props: FilePreviewProps) => {
  const { state, actions, file } = props

  const onclose = (e: Event) => {
    actions.previewFile(null)
  }
  if (isNotFound(file)) {
    return (
      <div class="file-preview">
        <h3>File not found!</h3>
        No file at path {file.path}!
        <a href="#" onclick={onclose}>
          Close Preview.
        </a>
      </div>
    )
  }

  return (
    <div class="file-preview">
      <div class="title-bar">
        <span>Preview of {file.path}</span>
        <button
          class="btn btn-clear"
          aria-label="Close"
          role="button"
          onclick={onclose}
        />
      </div>
      {Preview({ state, actions, file })}
    </div>
  )
}
