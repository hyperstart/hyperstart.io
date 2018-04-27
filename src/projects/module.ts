import { set } from "lib/immutable"
import { ModuleImpl } from "lib/modules"
import { getSearches, normalize } from "lib/search"
import * as store from "lib/store"

import * as api from "./api"
import { createProject } from "./createProject"
import { SourceEditor } from "editor/components/SourceEditor"
import { getErrorMessage } from "lib/utils"
import { importProjects } from "projects/importProjects"
import { COLLECTION } from "."
import { importBundle } from "./bundle"

interface SetStatusPayload {
  id: string
  loading: boolean
  error?: string
}

// actions in this interface are only accessible to other actions!
// At least from a type perspective...
interface Actions extends api.Actions {
  _setProject(project: api.Project)
}

function path(project?: string) {
  if (project) {
    return `${COLLECTION}/${project}/files`
  }
  return COLLECTION
}

function fetchDetails(
  store: store.Store,
  state: api.State,
  id: string
): Promise<api.Details> {
  if (state[id] && state[id].details) {
    return Promise.resolve(state[id].details)
  }

  return store.getById({ collection: path(), id })
}

// modify the project (in place) to ensure older versions are loaded properly
function backCompatible(project: api.Project): api.Project {
  const mainFile = project.details.mainFile
  if (mainFile && !mainFile.startsWith("/")) {
    project.details.mainFile = "/" + mainFile
  }
  return project
}

function updateProjectFiles(
  state: api.State,
  actions: Actions,
  store: store.Store,
  id: string,
  oldFiles: api.Files,
  files: api.Files
): Promise<void> {
  const collection = path(id)
  // added/updated files
  const toSet: store.DocumentToSet[] = []
  Object.keys(files).forEach(id => {
    if (oldFiles[id] !== files[id]) {
      toSet.push({
        collection,
        id,
        document: files[id]
      })
    }
  })
  // deleted files
  const toDelete: store.DocumentToDelete[] = []
  Object.keys(oldFiles).forEach(id => {
    if (!files[id]) {
      toDelete.push({ collection, id })
    }
  })

  return store.update({ toSet, toDelete }).then(() => {
    const project: api.Project = {
      details: state[id].details,
      files
    }
    actions._setProject(project)
  })
}

export function createProjects(
  store: store.Store
): ModuleImpl<api.State, api.Actions> {
  const impl: ModuleImpl<api.State, Actions> = {
    state: {},
    actions: {
      // # Internal
      init: () => {},
      getState: () => state => state,
      _setProject: project => ({ [project.details.id]: project }),
      // # Projects
      save: (project: api.Project) => (
        state,
        actions
      ): Promise<api.Project> => {
        const { details, files } = project
        const id = details.id
        const toSet: store.DocumentToSet[] = [
          {
            collection: path(),
            document: <any>details,
            id
          }
        ].concat(
          Object.keys(files).map(key => {
            const file = files[key]
            return {
              collection: path(id),
              document: file,
              id: file.id
            }
          })
        )

        actions._setProject({
          details,
          files
        })
        return store.update({ toSet }).then(() => {
          const result = {
            details,
            files,
            status: { loading: false, error: null }
          }

          actions._setProject(result)

          return result
        })
      },
      update: (project: api.UpdatedProject) => (
        state,
        actions
      ): Promise<api.Project> => {
        const { id, name, owner } = project
        const document: any = {}

        if (name) {
          const sanitizedName = normalize(name)
          document.name = sanitizedName
          document.searches = getSearches(sanitizedName)
        }
        if (owner) {
          document.owner = owner
        }
        const toUpdate: store.DocumentToUpdate[] = [
          { id, collection: path(), document }
        ]
        return store.update({ toUpdate }).then(() => {
          const updated = { ...state[id] }
          updated.details = { ...updated.details, ...document }
          actions._setProject(updated)
          return updated
        })
      },
      fetch: (id: string) => (state, actions): Promise<api.Project> => {
        const project = state[id]
        if (project && project.files) {
          return Promise.resolve(project)
        }

        let details: api.Details
        return fetchDetails(store, state, id)
          .then(result => {
            details = result
            return store.query({ collection: path(id) })
          })
          .then((results: api.File[]) => {
            const project: api.Project = backCompatible({
              details,
              files: {}
            })
            results.forEach(file => (project.files[file.id] = file))

            actions._setProject(project)
            return project
          })
      },
      // # Files
      addFiles: (payload: api.AddFilesPayload) => (
        state,
        actions
      ): Promise<void> => {
        const { id, files } = payload
        const collection = path(id)
        const newFiles: api.Files = {}
        const toSet: store.DocumentToSet[] = files.map(file => {
          newFiles[file.id] = file
          return { collection, id: file.id, document: file }
        })

        return store.update({ toSet }).then(() => {
          const updated = { ...state[id] }
          updated.files = { ...updated.files, ...newFiles }
          actions._setProject(updated)
        })
      },
      updateFiles: (payload: api.UpdateFilesPayload) => (
        state,
        actions
      ): Promise<void> => {
        const { id, files } = payload
        const collection = path(id)
        const newFiles: api.Files = { ...state[id].files }
        const toUpdate: store.DocumentToUpdate[] = files.map(file => {
          const { id, name, content } = file
          const document: any = {}
          if (typeof name === "string") {
            newFiles[id].name = name
            document.name = name
          }
          if (typeof content === "string") {
            newFiles[id].content = content
            document.content = content
          }
          return { collection, id, document }
        })

        return store.update({ toUpdate }).then(() => {
          const project: api.Project = {
            details: state[id].details,
            files: newFiles
          }
          actions._setProject(project)
        })
      },
      deleteFiles: (payload: api.DeleteFilesPayload) => (
        state,
        actions
      ): Promise<void> => {
        const { id, files } = payload
        const collection = path(id)
        const newFiles: api.Files = { ...state[id].files }
        const toDelete: store.DocumentToDelete[] = files.map(id => {
          delete newFiles[id]
          return {
            collection,
            id
          }
        })

        return store.update({ toDelete }).then(() => {
          const project: api.Project = {
            details: state[id].details,
            files: newFiles
          }
          actions._setProject(project)
        })
      },
      importProjects: (payload: api.ImportProjectsPayload) => (
        state,
        actions
      ): Promise<void> => {
        const { id, projects } = payload

        const oldFiles = state[id].files
        const files = importProjects(oldFiles, projects)

        return updateProjectFiles(state, actions, store, id, oldFiles, files)
      },
      importBundle: (payload: api.ImportBundlePayload) => (state, actions) => {
        const { id, bundle } = payload

        const oldFiles = state[id].files
        const files = importBundle(bundle, oldFiles)

        return updateProjectFiles(state, actions, store, id, oldFiles, files)
      }
    }
  }

  return impl
}
