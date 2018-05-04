import { Store } from "lib/store"
import { fetchContentJson } from "lib/fetchContent"

import * as api from "../api"
import { COLLECTION } from "../constants"

interface Listener {
  (project: api.Project, error?: any): void
}

interface Listeners {
  [id: string]: Listener[]
}

const listeners: Listeners = {}

export const fetch = (store: Store) => (id: string) => (
  state: api.State,
  actions: api.InternalActions
): Promise<api.Project> => {
  const existing = state[id]
  if (existing === "loading") {
    if (!listeners[id]) {
      listeners[id] = []
    }
    return new Promise((resolve, reject) => {
      listeners[id].push((project, e) => {
        if (project) {
          resolve(project)
        } else {
          reject(e)
        }
      })
    })
  }

  if (existing) {
    return Promise.resolve(existing)
  }

  let details: api.ProjectDetails
  actions._setProject({ id, project: "loading" })
  return store
    .getById({ collection: COLLECTION, id })
    .then((d: api.ProjectDetails) => {
      details = d
      return fetchContentJson(d.filesUrls)
    })
    .then(files => {
      const project = {
        details,
        files
      }

      if (listeners[id]) {
        listeners[id].forEach(l => l(project, null))
      }

      actions._setProject({ id, project })

      return project
    })
    .catch(e => {
      actions._setProject({ id, project: null })
      throw e
    })
}
