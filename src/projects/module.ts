import { ModuleImpl } from "lib/modules"
import { getSearches, normalize } from "lib/search"
import * as store from "lib/store"

import * as global from "api"
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
      _users: null,
      init: (global: global.Actions) => (state, actions) => {
        actions._users = global.users
      },
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
