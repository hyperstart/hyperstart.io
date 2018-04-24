import { ModuleImpl } from "lib/modules"
import { Bundle } from "lib/bundler"

import * as api from "./api"

interface Actions extends api.Actions {
  _add(bundle: Bundle)
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
    _add: (bundle: Bundle) => ({
      [`${bundle.name}@${bundle.version}`]: bundle
    }),
    // ## Public
    getFromNpmPackage: (payload: api.GetBundlePayload) => state => {
      const { name, version } = payload
    }
  }
}
export const bundles: ModuleImpl<api.State, api.Actions> = _bundles
