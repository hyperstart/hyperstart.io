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

/**
 * Generic compare function that works with any primitive type including null and undefined.
 */
export const compare = (obj1: any, obj2: any): number => {
  if (obj1 === obj2) {
    return 0
  }

  if (obj1 === undefined) {
    return 1
  } else if (obj1 === null) {
    return obj2 === undefined ? -1 : 1
  } else if (obj2 === null || obj2 === undefined) {
    return -1
  }
  return obj1 < obj2 ? -1 : 1
}
