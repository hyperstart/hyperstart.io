import { getExtension } from "utils"

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

const KNOWN_EXTENSIONS = {
  js: true,
  jsx: true,
  ts: true,
  tsx: true,
  html: true,
  css: true,
  json: true
}

/**
 *
 */
export function resolveId(importee: string, importer?: string): string {
  // index.js
  if (!importer) {
    return importee
  }

  // local import
  if (importee.startsWith(".")) {
    const folder = getParentPath(getSegments(importer))
    const local = getSegments(importee)
    const segments = folder.concat(local)
    const result = []
    for (const segment of segments) {
      if (segment === "..") {
        result.pop()
      } else if (segment !== ".") {
        result.push(segment)
      }
    }

    const resolved = "/" + result.join("/")
    const extension = getExtension(resolved)
    return KNOWN_EXTENSIONS[extension] ? resolved : resolved + ".js"
  }

  // dependency
  return importee
}
