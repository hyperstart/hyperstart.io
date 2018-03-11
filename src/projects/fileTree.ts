import { StringMap } from "lib/utils"

import { File, Project } from "./api"

export type FileNode = SourceNode | FolderNode

export interface BaseFile {
  id: string
  name: string
  path: string
  parent?: string
}

export interface SourceNode extends BaseFile {
  type: "file"
  content?: string
  original?: string
  url?: string
}

export interface FolderNode extends BaseFile {
  type: "folder"
  children: string[]
  projectId?: string
  expanded?: boolean
}

export interface FileTree {
  byId: StringMap<FileNode>
  byPath: StringMap<string>
  roots: string[]
}

const getFileNode = (file: File, source?: SourceNode): FileNode => {
  if (file.type === "file") {
    const result: SourceNode = {
      id: file.id,
      type: "file",
      name: file.name,
      content: source ? source.content : file.content,
      original: file.content,
      path: ""
    }

    if (file.url) {
      result.url = file.url
    }
    return result
  } else {
    const result: FolderNode = {
      id: file.id,
      type: "folder",
      name: file.name,
      children: [],
      path: ""
    }
    if (file.projectId) {
      result.projectId = file.projectId
    }
    return result
  }
}

const sort = (files: FileTree, nodes: string[]): void => {
  nodes.sort((id1, id2) => {
    const f1 = files.byId[id1]
    const f2 = files.byId[id2]
    if (f1.type !== f2.type) {
      return f1.type === "file" ? 1 : -1
    }
    return f1.name.localeCompare(f2.name)
  })
}

const computePath = (files: FileTree, file: FileNode): string => {
  if (file.path) {
    return file.path
  }

  if (file.parent) {
    const path = computePath(files, files.byId[file.parent]) + "/" + file.name
    file.path = path
    return path
  }

  const path = file.name
  file.path = path
  return path
}

export const getFileTree = (
  files: StringMap<File>,
  tree?: FileTree
): FileTree => {
  let result = {
    byId: {},
    byPath: {},
    roots: []
  }

  // first pass, populate by ID
  Object.keys(files).forEach(id => {
    const source = tree ? (tree.byId[id] as SourceNode) : null
    result.byId[id] = getFileNode(files[id], source)
  })

  // second pass: populate parents/children
  Object.keys(files).forEach(id => {
    const file = files[id]
    if (file.parent) {
      const node = result.byId[id]
      const parent = result.byId[file.parent] as FolderNode
      if (file.parent) {
        node.parent = file.parent
        parent.children.push(node.id)
      }
    }
  })

  // third pass: compute path & populate sources
  Object.keys(files).forEach(id => {
    const node = result.byId[id]
    const path = computePath(result, node)
    result.byPath[path] = id
    if (node.type === "folder") {
      sort(result, node.children)
    }
    if (!node.parent) {
      result.roots.push(node.id)
    }
  })

  sort(result, result.roots)

  return result
}

export const getByName = (
  tree: FileTree,
  name: string,
  parent?: string
): FileNode | null => {
  const children = parent
    ? (tree.byId[parent] as FolderNode).children
    : tree.roots

  for (let id of children) {
    const file = tree.byId[id]
    if (file.name === name) {
      return file
    }
  }

  return null
}

export const getChildrenRecursive = (
  tree: FileTree,
  node: FileNode,
  result: string[] = []
) => {
  if (node.type === "folder") {
    node.children.forEach(child => {
      result.push(child)
      getChildrenRecursive(tree, tree.byId[child], result)
    })
  }

  return result
}
