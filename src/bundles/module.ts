import { ModuleImpl } from "lib/modules"
import { Bundle, getId, bundle } from "lib/bundle"

import * as api from "./api"

interface AddActionPayload {
  bundle: Bundle
  version?: string
}

interface Actions extends api.Actions {
  _add(payload: AddActionPayload)
}

const _bundles: ModuleImpl<api.State, Actions> = {
  // # State
  state: {},
  // # Actions
  actions: {
    // ## Internal
    getState: () => state => state,
    init: () => {
      // nothing
    },
    _add: (payload: AddActionPayload) => {
      const { bundle, version = bundle.version } = payload
      return {
        [getId(bundle.name, version)]: bundle
      }
    },
    // ## Public
    getFromNpmPackage: (payload: api.GetBundlePayload) => (state, actions) => {
      const { name, version } = payload
      const result = state[getId(name, version || "latest")]
      if (result) {
        return Promise.resolve(result)
      }

      return bundle(name, version).then(bundle => {
        actions._add({ bundle })
        if (!version) {
          actions._add({ bundle, version: "latest" })
        }
        return bundle
      })
    }
  }
}
export const bundles: ModuleImpl<api.State, api.Actions> = _bundles
