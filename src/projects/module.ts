import { ModuleImpl } from "lib/modules"
import { getSearches, normalize } from "lib/search"
import * as store from "lib/store"

import * as api from "./api"
import { COLLECTION } from "./constants"
import { fetch, save } from "./actions"

export function createProjects(
  store: store.Store
): ModuleImpl<api.State, api.Actions> {
  const impl: ModuleImpl<api.State, api.InternalActions> = {
    state: {},
    actions: {
      // # Internal
      init: () => {},
      getState: () => state => state,
      _setProject: ({ id, project }: api._SetProjectPayload) => {
        return { [id]: project }
      },
      // # Projects
      fetch: fetch(store),
      save: save(store)
    }
  }

  return impl
}
