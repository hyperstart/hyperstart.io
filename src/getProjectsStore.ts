import { firestore } from "lib/store/firestore"
import { local } from "lib/store/local"
import { Cache, Store } from "lib/store"

// populated from the config folder.
interface StoreConfig {
  type: "firestore" | "local"
  localCache?: Cache
}
declare const STORE_CONFIG: StoreConfig

export function getProjectsStore(): Store {
  switch (STORE_CONFIG.type) {
    case "local":
      const cache = STORE_CONFIG.localCache
      if (!cache) {
        throw new Error(
          "STORE_CONFIG must contain a localCache when type === local"
        )
      }
      return local(cache)
    case "firestore":
      return firestore()
    default:
      throw new Error("Unexpected store config type: " + STORE_CONFIG.type)
  }
}
