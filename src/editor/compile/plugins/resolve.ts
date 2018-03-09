import { DiagnosticCategory } from "lib/typescript"

import { DEPENDENCIES_FOLDER } from "projects"

import { getSource } from "../../selectors"
import { State } from "../../api"
import { CompileOutput } from "../api"

const suffixes = [
  "",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  "/index.js",
  "/index.jsx",
  "/index.ts",
  "/index.tsx"
]

const getParentPath = (path: string[]): string[] => {
  if (path.length === 0) {
    throw new Error("Path is empty.")
  }
  return path.slice(0, path.length - 1)
}

const getSegments = (path: string): string[] => {
  let segments = path.split("/")
  if (segments.length === 0) {
    return segments
  }

  if (segments[0] === "") {
    segments = segments.slice(1)
  }
  if (segments.length > 0 && segments[segments.length - 1] === "") {
    segments = getParentPath(segments)
  }

  return segments
}

const removeSlash = (path: string): string => {
  return path.startsWith("/") ? path.substring(1) : path
}

/**
 *
 */
const getGlobalPath = (
  state: State,
  localPath: string,
  relativeTo?: string
): string => {
  // index.js
  if (!relativeTo) {
    return removeSlash(localPath)
  }

  // global path
  if (localPath.startsWith("/")) {
    return removeSlash(localPath)
  }

  // local import
  if (localPath.startsWith(".")) {
    const folder = getParentPath(getSegments(relativeTo))
    const local = getSegments(localPath)
    const segments = folder.concat(local)
    const result = []
    for (const segment of segments) {
      if (segment === "..") {
        result.pop()
      } else if (segment !== ".") {
        result.push(segment)
      }
    }
    return result.join("/")
  }

  // dependency
  return DEPENDENCIES_FOLDER + "/" + localPath
}

/**
 *
 */
const resolveId = (
  state: State,
  importee: string,
  importer?: string
): string => {
  const path = getGlobalPath(state, importee, importer)

  // try all possible suffixes
  for (const suffix of suffixes) {
    const resolved = path + suffix
    if (getSource(state, resolved)) {
      return resolved
    }
  }

  return null
}

export const resolve = (state: State, result: CompileOutput): any => {
  return {
    name: "hyperstart-resolve",
    resolveId(importee: string, importer: string): string {
      const resolved = resolveId(state, importee, importer)
      if (!resolved) {
        if (importer) {
          result.modules[importer] = [
            {
              category: DiagnosticCategory.Error,
              message: "Cannot find module " + importee
            }
          ]
          throw new Error("Error while compiling")
        } else {
          throw new Error("Cannot find module " + importee)
        }
      }
      return resolved
    },
    load(id: string): string {
      return getSource(state, id).content
    }
  }
}
