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
