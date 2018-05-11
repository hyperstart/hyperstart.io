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

    return "/" + result.join("/")
  }

  // dependency
  return importee
}
