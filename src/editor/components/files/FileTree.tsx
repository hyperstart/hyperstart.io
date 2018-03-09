import { h } from "hyperapp"

import { Tree } from "lib/components"

import { FileNode, SourceNode } from "projects/fileTree"

import { FolderItem } from "./FolderItem"
import { FileItem } from "./FileItem"

import { State, Actions } from "../../api"

// # NodeView

interface NodeViewProps {
  state: State
  actions: Actions
  path: string
  file: FileNode
}

const NodeView = (props: NodeViewProps) => {
  if (props.file.type === "file") {
    return FileItem(props as any)
  }
  return FolderItem(props as any)
}

// # FileTree

export interface FileTreeProps {
  state: State
  actions: Actions
}

const getChildren = (state: State) => (file: FileNode) => {
  if (file.type === "file" || !file.expanded) {
    return null
  }
  return file.children.map(id => state.files.byId[id])
}

const toggleExpanded = (actions: Actions) => (node: FileNode) => {
  actions.toggleFileExpanded(node.path)
}

const getItems = (state: State): FileNode[] =>
  state.files.roots.map(id => state.files.byId[id])

export const FileTree = (props: FileTreeProps) => {
  const { state, actions } = props

  const treeProps: any = {
    View: NodeView,
    getChildren: getChildren(state),
    items: getItems(state),
    toggleExpanded: toggleExpanded(actions),
    class: "file-tree",
    nodeClass: "file-node",
    itemProps: props
  }
  return Tree<FileNode>(treeProps)
}
