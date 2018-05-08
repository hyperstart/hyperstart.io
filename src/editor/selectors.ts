import { StringMap } from "lib/utils"
import { PackageJson, inferMainFile } from "lib/npm"
import { concat } from "lib/fs"

import { DEPENDENCIES_FOLDER_PATH, HYPERAPP_NAME, File, Files } from "projects"

import { State, FileNode, FileNotFound } from "./api"
import { Run } from "./debug/api"

export function getFile(state: State, path: string): File | null {
  return (state.project && state.project.files[path]) || null
}

export function getFileNode(state: State, path: string): FileNode | null {
  return state.fileTree[path] || null
}

export function isEditorDirty(state: State): boolean {
  if (!state.project) {
    return false
  }
  if (state.status === "local-only") {
    return true
  }
  return state.project !== state.original
}

export function askForSaveOnLeave(state: State): boolean {
  if (!state.project) {
    return false
  }
  return state.project.files !== state.original.files
}

export function isNew(state: State, path: string): boolean {
  if (!state.project || state.status === "local-only") {
    return false
  }

  return state.project.files[path] && !state.original.files[path]
}

export function isDirty(state: State, path: string): boolean {
  if (!state.project || state.status === "local-only") {
    return false
  }

  return state.project.files[path] !== state.original.files[path]
}

function compareRuns(r1: Run, r2: Run): number {
  return r1.timestamp - r2.timestamp
}

export function getRuns(runs: StringMap<Run>): Run[] {
  return Object.keys(runs)
    .map(key => runs[key])
    .sort(compareRuns)
}

export function getPackageJsonInFolder(
  state: State,
  path: string
): PackageJson | null {
  const file = getFile(state, concat(path, "/package.json"))
  if (!file) {
    return null
  }

  return JSON.parse(file.content)
}

export function isDebuggable(state: State): boolean {
  if (state.status === "closed") {
    return false
  }

  const pkg = getPackageJsonInFolder(
    state,
    `${DEPENDENCIES_FOLDER_PATH}/${HYPERAPP_NAME}`
  )
  if (pkg && pkg.version === "1.2.5") {
    return true
  }

  // fallback for old projects
  const path = `${DEPENDENCIES_FOLDER_PATH}/${HYPERAPP_NAME}/index.js`
  return !!getFile(state, path)
}

export function getHyperappJsMainFile(state: State): string | null {
  if (!state.project) {
    return null
  }

  const pkg = getPackageJsonInFolder(
    state,
    `${DEPENDENCIES_FOLDER_PATH}/${HYPERAPP_NAME}`
  )
  return `${DEPENDENCIES_FOLDER_PATH}/${HYPERAPP_NAME}/${
    pkg ? inferMainFile(pkg) : "index.js"
  }`
}

export function getSelectedFile(state: State): FileNode | null {
  const selected = state.selectedSources
  if (selected.length === 0) {
    return null
  }
  const path = selected[0]
  return state.fileTree[path]
}

export function isNotFound(file: any): file is FileNotFound {
  return file.notFound === true
}

export function getPreviewedFile(state: State): FileNode | FileNotFound | null {
  const paths = window.location.pathname.substr(1).split("/")
  if (paths.length < 3) {
    return null
  }

  paths.shift()
  paths.shift()
  const path = "/" + paths.join("/")

  const result = state.fileTree[path]
  if (!result || result.type !== "file") {
    return { notFound: true, path }
  }

  return result
}

// import { State, FileNotFound } from "./api"
// import { inferMainFile } from "lib/npm"

// export function isEditable(state: State): boolean {
//   return state.status === "editing"
// }

// export function fileExists(
//   state: State,
//   name: string,
//   parent?: string
// ): boolean {
//   const files = state.files.byId
//   for (let id in files) {
//     const file = files[id]
//     if (file.name === name && file.parent == parent) {
//       return true
//     }
//   }

//   return false
// }

// export function isDirty(source: FileNode): boolean {
//   return source.type === "file" && source.content !== source.original
// }

// export function getDirtySources(state: State): string[] {
//   const files: any = state.files.byId
//   return Object.keys(files).filter(key => isDirty(files[key]))
// }

// export function getSource(
//   state: State,
//   path: string,
//   failOnNull: boolean
// ): SourceNode | null {
//   const id = state.files.byPath[path]
//   const result = id ? state.files.byId[id] : null
//   if (result && result.type === "file") {
//     return result
//   }
//   if (failOnNull) {
//     throw new Error(
//       "Error while loading source at " +
//         path +
//         ". Source: " +
//         JSON.stringify(result)
//     )
//   }
//   return null
// }

// export function getFiles(state: State): Files {
//   const result: Files = {}

//   const files = state.files.byId
//   Object.keys(files).forEach(id => {
//     result[id] = getFile(files[id])
//   })

//   return result
// }
