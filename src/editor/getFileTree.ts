import {
  Project,
  ROOT_PATH,
  DEPENDENCIES_FOLDER_PATH,
  DEPENDENCIES_FOLDER_NAME
} from "projects"

import { FileNode, FileTree, State } from "./api"
import { getName } from "lib/fs"

function getPath(segments: string[]): string {
  const result = segments.join("/")
  return result === "" ? "/" : result
}

function ensureParentFolders(
  payload: GetFileTreePayload,
  tree: FileTree,
  node: FileNode
) {
  const segments = node.path.split("/")
  segments.pop()
  const path = getPath(segments)
  const name = segments.pop()

  if (tree[path]) {
    tree[path].children.push(node.path)
    return
  }

  const expandedFolders = payload.expandedFolders || {}

  const parent: FileNode = {
    type: "folder",
    name: name,
    path,
    children: [node.path],
    expanded: expandedFolders[path] || false
  }

  tree[path] = parent
  ensureParentFolders(payload, tree, parent)
}

function getRoot(payload: GetFileTreePayload): FileNode {
  return {
    type: "folder",
    name: "files",
    path: ROOT_PATH,
    children: [DEPENDENCIES_FOLDER_PATH],
    expanded: payload.expandedFolders[ROOT_PATH]
  }
}

function getDependencies(payload: GetFileTreePayload): FileNode {
  return {
    type: "folder",
    name: DEPENDENCIES_FOLDER_NAME,
    path: DEPENDENCIES_FOLDER_PATH,
    children: [],
    expanded: payload.expandedFolders[DEPENDENCIES_FOLDER_PATH]
  }
}

const comparePaths = (tree: FileTree) => (
  path1: string,
  path2: string
): number => {
  const node1 = tree[path1]
  const node2 = tree[path2]

  const typeCompare = node1.type.localeCompare(node2.type)
  if (typeCompare !== 0) {
    return -typeCompare
  }

  return node1.name.localeCompare(node2.name)
}

export interface GetFileTreePayload {
  project?: Project
  expandedFolders?: { [path: string]: boolean }
}

export function getFileTree(payload: GetFileTreePayload): FileTree {
  if (!payload.project) {
    return {}
  }

  const result: FileTree = {}
  result[ROOT_PATH] = getRoot(payload)
  result[DEPENDENCIES_FOLDER_PATH] = getDependencies(payload)

  // create for files & parents
  const files = payload.project.files
  Object.keys(files).forEach(path => {
    if (!files[path]) {
      return
    }

    result[path] = {
      type: "file",
      name: getName(path),
      path
    }

    ensureParentFolders(payload, result, result[path])
  })

  // order children
  const compare = comparePaths(result)
  Object.keys(result).forEach(path => {
    const node = result[path]
    if (node.type !== "folder") {
      return
    }

    node.children.sort(compare)
  })

  return result
}
