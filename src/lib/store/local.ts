import { Cache, Store, Where, UpdatePayload } from "./api"
import { queryCache } from "./queryCache"
import { updateCache } from "./updateCache"

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
      return Promise.resolve(queryCache(cache, payload))
    },
    update(payload) {
      const updated = updateCache(cache, payload)
      cache = updated.cache
      return Promise.resolve(updated.result)
    }
  }
}
