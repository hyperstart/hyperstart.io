/**
 * Creates a promise that resolves to the given value after the given timeout.
 */
export const resolveAfter = <T>(value: T, timeout: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, timeout)
  })
}

/**
 * Creates a promise that rejects with the given reason after the given timeout.
 */
export const rejectAfter = <T>(reason: any, timeout: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      reject(reason)
    }, timeout)
  })
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
