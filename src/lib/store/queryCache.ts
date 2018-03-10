import { compare } from "lib/utils"
import { Cache, QueryPayload, Where } from "./api"

// # Utilities

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

// # Query Cache

export function queryCache<T>(cache: Cache, payload: QueryPayload): T[] {
  const collection = cache[payload.collection]
  if (!collection) {
    return []
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

  return results.slice(start, end)
}
