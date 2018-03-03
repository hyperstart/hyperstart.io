import { Store, Where } from "./api"

import { compare } from "lib/utils"

export interface Collection {
  [id: string]: any
}

export interface Cache {
  [collection: string]: Collection
}

function isMatch(document: any = {}, where: Where): boolean {
  const value = document[where.attribute]
  switch (where.op) {
    case "<":
      return value < where.value
    case "<=":
      return value <= where.value
    case "==":
      return value === where.value
    case ">=":
      return value >= where.value
    case ">":
      return value > where.value
  }
  return false
}

function getStart(results: any[], first: any): number {
  if (typeof first === "number") {
    return first
  }
  if (first === undefined) {
    return 0
  }
  const result = results.indexOf(first)
  if (result < 0) {
    throw new Error("payload.first not found in results.")
  }
  return result
}

function getEnd(results: any[], start: number, limit?: number): number {
  if (!limit) {
    return results.length
  }

  const result = start + limit
  return result >= results.length ? results.length : result
}

export function local(cache: Cache = {}): Store {
  return {
    getById(payload) {
      const collection = cache[payload.collection]
      if (!collection) {
        return Promise.resolve(null)
      }
      return Promise.resolve(collection[payload.id] || null)
    },
    query(payload) {
      const collection = cache[payload.collection]
      if (!collection) {
        return Promise.resolve([])
      }

      const results = []
      // collect results
      Object.keys(collection).forEach(key => {
        const document = collection[key]
        if (
          !payload.where ||
          payload.where.reduce(
            (match, where) => match && isMatch(document, where),
            true
          )
        ) {
          results.push(document)
        }
      })

      // order results
      if (payload.orderBy) {
        results.sort((doc1, doc2) => {
          const result = compare(
            doc1[payload.orderBy.attribute],
            doc2[payload.orderBy.attribute]
          )
          return payload.orderBy.descending ? -result : result
        })
      }

      // apply pagination
      const start = getStart(results, payload.first)
      const end = getEnd(results, start, payload.limit)

      return Promise.resolve(results.slice(start, end))
    },
    update(payload) {
      payload.toCreate.forEach(toCreate => {
        // TODO
      })
      payload.toUpdate.forEach(toUpdate => {
        // TODO
      })
      payload.toSet.forEach(toSet => {
        // TODO
      })
      payload.toDelete.forEach(toDelete => {
        // TODO
      })
      return Promise.reject("Not implemented yet.")
    }
  }
}
