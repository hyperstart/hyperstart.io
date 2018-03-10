import { ModuleImpl } from "lib/modules"
import { Store, DocumentToSet, DocumentToUpdate } from "lib/store"

import * as api from "./api"
import { createProject } from "./createProject"
import { SourceEditor } from "editor/components/SourceEditor"
import { getErrorMessage } from "lib/utils"

// actions in this interface are only accessible to other actions!
// At least from a type perspective...
interface Actions extends api.Actions {
  _setProject(project: api.Project)
}

function path(project?: string) {
  if (project) {
    return `projects/${project}/files`
  }
  return "projects"
}

export function createProjects(
  store: Store
): ModuleImpl<api.State, api.Actions> {
  const impl: ModuleImpl<api.State, Actions> = {
    state: {},
    actions: {
      // # Common
      init: () => {},
      getState: () => state => state,
      // # Internal
      _setProject: project => ({ [project.details.id]: project }),
      // # Projects
      createAndSave: (template: api.Template) => (
        state,
        actions
      ): Promise<api.Project> => {
        return createProject({ actions, template }).then(actions.add)
      },
      add: (project: api.Project) => (state, actions): Promise<api.Project> => {
        const { details, files } = project
        const id = details.id
        const toSet: DocumentToSet[] = [
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
          files,
          status: { loading: true, error: null }
        })
        return store
          .update({ toSet })
          .then(() => {
            const result = {
              details,
              files,
              status: { loading: false, error: null }
            }

            actions._setProject(result)
            return result
          })
          .catch(e => {
            const result = {
              details,
              files,
              status: { loading: false, error: getErrorMessage(e) }
            }

            actions._setProject(result)
            throw e
          })
      },
      update: (project: api.UpdatedProject) => (
        state,
        actions
      ): Promise<void> => {
        const { id, name, owner } = project
        const document: any = {}
        // TODO compute searches...
        if (name) document.name = name
        if (owner) document.owner = owner
        const toUpdate: DocumentToUpdate[] = [
          {
            id,
            collection: path(),
            document
          }
        ]

        // TODO
        return store
          .update({ toUpdate })
          .then(() => {
            // TODO
          })
          .catch(e => {
            // TODO
            throw e
          })
      },
      fetch: (id: string) => (state, actions): Promise<api.Project> => {
        // TODO
        return null
      },
      // # Files
      addFiles: (files: File[]) => (state, actions): Promise<void> => {
        // TODO
        return null
      },
      updateFiles: (updates: api.FileUpdate[]) => (
        state,
        actions
      ): Promise<void> => {
        // TODO
        return null
      },
      deleteFiles: (files: api.DeletedFile[]) => (
        state,
        actions
      ): Promise<void> => {
        // TODO
        return null
      },
      importProjects: (projects: api.ImportedProject[]) => (
        state,
        actions
      ): Promise<void> => {
        // TODO
        return null
      }
    }
  }

  return impl
}
