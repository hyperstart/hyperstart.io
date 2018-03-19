import { Cache, Store, Where, UpdatePayload } from "./api"
import { queryCache } from "./queryCache"
import { updateCache } from "./updateCache"

export function local(cache: Cache = {}): Store {
  return {
    getById(payload) {
      const collection = cache[payload.collection]
      if (!collection) {
        return Promise.reject(
          "Cannot find collection with name " + payload.collection
        )
      }
      const result = collection[payload.id]
      if (!result) {
        return Promise.reject("Cannot find resource with id " + payload.id)
      }
      return Promise.resolve(result)
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
