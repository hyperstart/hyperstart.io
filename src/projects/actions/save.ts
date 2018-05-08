import firebase from "firebase"

import { Store, DocumentToSet } from "lib/store"

import * as api from "../api"
import { COLLECTION, NEW_PROJECT_ID } from "../constants"

function getFilesRef(id: string, owner: string) {
  return firebase.storage().ref(`projects/files/${owner}/${id}.json`)
}

function getExisting(state: api.State, id: string): api.Project {
  const existing = state[id]
  if (!existing || existing === "loading") {
    return {
      details: null,
      files: {}
    }
  }

  return existing
}

interface SaveFileResult {
  url: string
  files: api.Files
}

function saveFiles(
  project: api.Project,
  existing: api.Files
): Promise<SaveFileResult> {
  const { details, files } = project
  if (files === existing) {
    return Promise.resolve({
      url: details.filesUrls,
      files
    })
  }

  const filesRef = getFilesRef(details.id, details.owner.id)
  return filesRef.putString(JSON.stringify(files)).then(snapshot => ({
    url: snapshot.downloadURL,
    files
  }))
}

function saveDetails(
  details: api.ProjectDetails,
  existing: api.ProjectDetails,
  store: Store,
  files: SaveFileResult
): Promise<api.Project> {
  if (details === existing) {
    return Promise.resolve({
      details,
      files: files.files
    })
  }

  const document =
    details.filesUrls === files.url
      ? details
      : {
          ...details,
          filesUrls: files.url
        }

  const toSet: DocumentToSet[] = [
    {
      collection: COLLECTION,
      document,
      id: details.id
    }
  ]

  return store.update({ toSet }).then(result => {
    return {
      details: document,
      files: files.files
    }
  })
}

export const save = (store: Store) => (project: api.Project) => (
  state: api.State,
  actions: api.InternalActions
): Promise<api.Project> => {
  const id = project.details.id

  if (id === NEW_PROJECT_ID) {
    throw new Error(`Cannot save project with id="new"`)
  }

  const { details, files } = getExisting(state, id)

  return actions._users
    .ensureUser() // ensure anonymous authentication.
    .then(() => saveFiles(project, files))
    .then(result => saveDetails(project.details, details, store, result))
    .then(project => {
      actions._setProject({ id, project })
      return project
    })
}
