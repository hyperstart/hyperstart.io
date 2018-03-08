export interface Function1<A, R> {
  (arg?: A): R
}
export interface Function2<A, B, R> {
  (arg1?: A, arg2?: B): R
}

const eq = (arg1: any, arg2: any): boolean => {
  if (typeof arg1 === "undefined") {
    return typeof arg2 === "undefined"
  }

  if (arg1 === null) {
    return arg2 === null
  }

  if (typeof arg1 === "object") {
    if (typeof arg2 === "object") {
      for (const key in arg1) {
        if (arg1[key] !== arg2[key]) {
          return false
        }
      }
      return true
    } else {
      return false
    }
  }

  return arg1 === arg2
}

/**
 * Lazy higher order functions for functions with one parameter.
 */
export const lazy1 = {
  /**
   * Compare the argument with the previous call's argument with === operator.
   */
  identity<A, R>(fn: Function1<A, R>): Function1<A, R> {
    let prev
    let result

    return arg => {
      if (typeof prev !== "undefined" && prev === arg) {
        return result
      }
      prev = arg
      result = fn(arg)
      return result
    }
  },

  /**
   * if the argument is an object, compare all its properties with the previous
   * call's argument with === operator to determine if equality (useful for memoized components).
   */
  shallow<A, R>(fn: Function1<A, R>): Function1<A, R> {
    let prev
    let result

    return arg => {
      if (typeof prev !== "undefined" && eq(prev, arg)) {
        return result
      }
      prev = arg
      result = fn(arg)
      return result
    }
  }
}

/**
 * Lazy higher order functions for functions with two parameters.
 */
export const lazy2 = {
  /**
   * Compare the arguments with the previous call's argument with === operator.
   */
  identity<A, B, R>(fn: Function2<A, B, R>): Function2<A, B, R> {
    let prev1
    let prev2
    let result

    return (arg1, arg2) => {
      if (typeof prev1 !== "undefined" && prev1 === arg1 && prev2 === arg2) {
        return result
      }
      prev1 = arg1
      prev2 = arg2
      result = fn(arg1, arg2)
      return result
    }
  }
}
