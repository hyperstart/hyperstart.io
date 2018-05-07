import { DiagnosticCategory } from "lib/typescript"
import { fetchContentString } from "lib/fetchContent"
import { createPairMap } from "lib/pairMap"
import { getErrorMessage } from "lib/utils"
import { concat } from "lib/fs"

import { DEPENDENCIES_FOLDER_PATH } from "projects"

import { State } from "../../api"
import { CompileOutput } from "../api"
import { getFile, getFileNode } from "../../selectors"
import { inferMainFile, PackageJson } from "lib/npm"

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

/**
 * Recursively checks all the enclosing folders and checks the ones that are projects, i.e. that contains
 * a package.json.
 *
 * @param state the editor state
 * @param path the path of the file to look from, must start with "/"
 */
function getEnclosingProjectsRoots(state: State, path: string): string[] {
  // e.g. ["", "dependencies", "@hyperapp", "render", "dependencies", "hyperapp", "index.js"]
  const candidates = path.split("/")
  // remove the file name
  candidates.pop()
  for (let i = 1; i < candidates.length; i++) {
    candidates[i] = concat(candidates[i - 1], candidates[i])
  }

  // includes the root even if there is no package.json.
  return candidates
    .filter(
      candidate =>
        candidate === "" || getFile(state, concat(candidate, "/package.json"))
    )
    .reverse()
}

function getMainFilePath(state: State, rootPath: string): string {
  const pkgJsonPath = concat(rootPath, "/package.json")
  const pkgJsonFile = getFile(state, pkgJsonPath)
  if (!pkgJsonFile) {
    // return the default main file
    return concat(rootPath, "/index.js")
  }

  try {
    const pkgJson: PackageJson = JSON.parse(pkgJsonFile.content)
    const mainFile = inferMainFile(pkgJson)

    if (mainFile) {
      return concat(rootPath, mainFile)
    }
    throw new Error(`No main or module set for ${pkgJsonPath}.`)
  } catch (e) {
    throw new Error(
      `Error while parsing file ${pkgJsonPath}: ${getErrorMessage(e)}`
    )
  }
}

/**
 *
 */
function getGlobalPath(
  state: State,
  localPath: string,
  relativeTo?: string
): string {
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
    const result: string[] = []
    for (const segment of segments) {
      if (segment === "..") {
        result.pop()
      } else if (segment !== ".") {
        result.push(segment)
      }
    }
    return concat(result)
  }

  // dependency: get the enclosing project's root folders from nested to outer
  const enclosingProjects = getEnclosingProjectsRoots(state, relativeTo)
  for (const project of enclosingProjects) {
    const rootPath = concat(project, "/dependencies", localPath)
    const node = getFileNode(state, rootPath)

    if (!node || node.type !== "folder") {
      continue
    }

    return getMainFilePath(state, rootPath)
  }

  throw new Error(`Could not resolve ${localPath} imported in ${relativeTo}.`)
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
    if (state.project.files[resolved]) {
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
        return fetchContentString(id).catch(e => {
          throw new Error("Cannot fetch " + id + ": " + getErrorMessage(e))
        })
      }
      const source = state.project.files[id]
      if (typeof source.content === "string") {
        return source.content
      }

      throw new Error("Cannot load " + id)
    }
  }
}
