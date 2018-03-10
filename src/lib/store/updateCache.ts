import { guid } from "lib/utils"
import { set, merge } from "lib/immutable"

import { Cache, UpdatePayload, UpdateCacheResult } from "./api"

export function updateCache(
  previousCache: Cache,
  update: UpdatePayload
): UpdateCacheResult {
  const { toSet = [], toUpdate = [], toDelete = [] } = update

  let cache = { ...previousCache }
  const result = { set: [], updated: [], deleted: [] }

  toSet.forEach(toSet => {
    const { collection, document, id = guid() } = toSet
    const col = cache[collection] || (cache[collection] = {})
    cache = set(cache, [collection, id], document)
    result.set.push({ collection, id, document })
  })

  toUpdate.forEach(toUpdate => {
    const { collection, document, id } = toUpdate
    const col = cache[collection] || (cache[collection] = {})
    cache = merge(cache, [collection, id], document)
    result.updated.push({ collection, id, document: cache[collection][id] })
  })

  toDelete.forEach(toDelete => {
    const { collection, id } = toDelete
    delete cache[collection][id]
    result.deleted.push({ collection, id })
  })

  return {
    cache,
    result
  }
}
