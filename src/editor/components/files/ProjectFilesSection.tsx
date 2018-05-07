import { h } from "hyperapp"

import { Tree } from "lib/components"

import { LogFn } from "logger"
import { ROOT_PATH } from "projects"

import { State, Actions, FileNode } from "../../api"
import { FolderItem } from "./FolderItem"
import { FileItem } from "./FileItem"
import { CreateFileModal } from "./CreateFileModal"
import { DeleteFileModal } from "./DeleteFileModal"

import "./ProjectFilesSection.scss"

export interface ProjectFilesSectionProps {
  state: State
  actions: Actions
  log: LogFn
}

interface ViewProps {
  state: State
  actions: Actions
  log: LogFn
  item: string
}

function View(props: ViewProps) {
  const { state, item } = props
  const node = state.fileTree[item]
  if (node.type === "folder") {
    return FolderItem(props)
  }
  return FileItem(props)
}

export function ProjectFilesSection(props: ProjectFilesSectionProps) {
  const { state, actions, log } = props

  function getChildren(path: string) {
    const node = state.fileTree[path]
    if (node.type === "folder") {
      return node.expanded ? node.children : []
    }
    return null
  }

  return (
    <div class="project-files-section">
      {Tree({
        View,
        items: ["/"],
        getChildren,
        toggleExpanded: actions.toggleFolder,
        itemProps: props,
        class: "file-tree",
        nodeClass: "file-node"
      })}
      {CreateFileModal(props)}
      {DeleteFileModal(props)}
    </div>
  )
}
