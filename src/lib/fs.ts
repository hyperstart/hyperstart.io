function sanitize(path: string): string {
  if (path === "" || path === "/") {
    return ""
  }

  const halfDone = path.endsWith("/") ? path.substr(0, path.length - 1) : path
  return path.startsWith("/") ? halfDone : "/" + halfDone
}

export function concat(...paths: (string | string[])[]): string {
  let result = ""
  for (const path of paths) {
    result += typeof path === "string" ? sanitize(path) : concat(...path)
  }
  return result
}

export function getName(path: string): string {
  const index = path.lastIndexOf("/")
  if (index < 0) {
    return path
  }
  return path.substring(index + 1)
}

export function getParentName(path: string): string {
  const last = path.lastIndexOf("/")
  const first = path.lastIndexOf("/", last - 1)
  if (first < 0) {
    return path
  }
  return path.substring(first + 1, last)
}
