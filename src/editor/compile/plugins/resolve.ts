import { DiagnosticCategory } from "lib/typescript"
import { fetchSource } from "lib/fetchSource"

import { DEPENDENCIES_FOLDER } from "projects"

import { getSource } from "../../selectors"
import { State } from "../../api"
import { CompileOutput } from "../api"
import { getErrorMessage } from "lib/utils"
import { createPairMap } from "lib/pairMap"

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

// const removeSlash = (path: string): string => {
//   return path.startsWith("/") ? path.substring(1) : path
// }

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
    return localPath
  }

  // global path
  if (localPath.startsWith("/")) {
    return localPath
  }

  // importing from http
  if (localPath.startsWith("http")) {
    return localPath
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
    return "/" + result.join("/")
  }

  // dependency
  return "/" + DEPENDENCIES_FOLDER + "/" + localPath
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

  if (path.startsWith("http")) {
    return path
  }

  // try all possible suffixes
  for (const suffix of suffixes) {
    const resolved = path + suffix
    if (getSource(state, resolved, false)) {
      return resolved
    }
  }

  return null
}

export function resolve(state: State, result: CompileOutput): any {
  const cache = createPairMap<string>()

  return {
    name: "hyperstart-resolve",
    resolveId(importee: string, importer: string): string {
      if (importee.startsWith("\0")) {
        return
      }
      const res = cache.get(importee, importer || "")
      if (res) {
        return res
      }

      const resolved = resolveId(state, importee, importer)
      if (!resolved) {
        return
      }

      cache.set(importee, importer || "", resolved)
      return resolved
    },
    load(id: string): string | Promise<string> {
      if (id.startsWith("\0")) {
        return
      }
      // TODO code better
      if (id.startsWith("http")) {
        return fetchSource(id).catch(e => {
          throw new Error("Cannot fetch " + id + ": " + getErrorMessage(e))
        })
      }
      const source = getSource(state, id, true)
      if (typeof source.content === "string") {
        return source.content
      }

      if (source.url) {
        return fetchSource(source.url)
      }

      throw new Error("Cannot load " + id)
    }
  }
}
