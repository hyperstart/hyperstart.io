export function getExtension(path: string): string {
  const segments = (path || "").split(".")
  if (segments.length === 0) {
    throw new Error('Cannot get extension from path: "' + path + '"')
  }
  return segments[segments.length - 1]
}

/**
 * Transform possible error objets in a message.
 */
export const getErrorMessage = (error: string | Error): string => {
  if (typeof error === "string") {
    return error
  }
  return error.message
}
