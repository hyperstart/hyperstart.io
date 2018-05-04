import { ModuleImpl } from "lib/modules"
import { Bundle, getId, bundle as createBundle } from "lib/bundle"

import * as api from "./api"
import { getLatestVersion } from "lib/unpkg"
import { getFunctionUrl } from "lib/firebase"

interface AddActionPayload {
  bundle: Bundle
  version?: string
}

interface Actions extends api.Actions {
  _add(payload: AddActionPayload)
}

function sanitize(pkg: string): string {
  // escape and sanitize
  return pkg.replace("/", "%252F")
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
    getFromNpmPackage: (payload: api.GetBundlePayload) => (
      state,
      actions
    ): Promise<Bundle> => {
      const { name, version } = payload

      // check local cache
      const result = state[getId(name, version || "latest")]
      if (result) {
        return Promise.resolve(result)
      }

      // check github raw content
      if (version) {
        const url = `https://raw.githubusercontent.com/hyperstart/hyperstart-bundles/master/bundles/${sanitize(
          name
        )}@${version}.json`

        return fetch(url)
          .then(res => {
            if (res.status !== 200) {
              throw new Error("not exist")
            }

            return res.json()
          })
          .then(bundle => {
            actions._add({ bundle })
            if (!version) {
              actions._add({ bundle, version: "latest" })
            }
            return bundle
          })
          .catch(e => {
            // fallback on the same mechanism
            return createBundle(name, version).then(bundle => {
              actions._add({ bundle })
              if (!version) {
                actions._add({ bundle, version: "latest" })
              }
              return bundle
            })
          })
      }

      return createBundle(name, version).then(bundle => {
        actions._add({ bundle })
        if (!version) {
          actions._add({ bundle, version: "latest" })
        }
        return bundle
      })
    },
    getFromNpmPackages: (payload: api.GetBundlePayload[]) => (
      state,
      actions
    ) => {
      return Promise.all(payload.map(actions.getFromNpmPackage))
    },
    getLatestVersion: (name: string): Promise<string> => {
      return getLatestVersion(name)
    },
    getVersions: (name: string): Promise<string[]> => {
      return fetch(
        getFunctionUrl(`get-npm-package-versions?package=${name}`)
      ).then(res => {
        return res.json()
      })
    }
  }
}
export const bundles: ModuleImpl<api.State, api.Actions> = _bundles
