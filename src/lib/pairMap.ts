import { StringMap } from "./utils"

interface Values<T> {
  [key: string]: StringMap<T>
}

export interface PairMap<T = any> {
  get(key1: string, key2: string): T
  set(key1: string, key2: string, value: T)
  getAll(key1: string): StringMap<T>
}

export function createPairMap<T = any>(): PairMap {
  const values: Values<T> = {}

  return {
    get(key1: string, key2: string): T {
      return values[key1] && values[key1][key2]
    },
    set(key1: string, key2: string, value: T) {
      if (!values[key1]) {
        values[key1] = {}
      }
      values[key1][key2] = value
    },
    getAll(key1: string): StringMap<T> {
      return values[key1] || {}
    }
  }
}
