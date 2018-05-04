import { guid, getErrorMessage, debounce } from "lib/utils"
import { ModuleImpl } from "lib/modules"
import { local } from "lib/store/local"
import { replace } from "lib/router"
import { set } from "lib/immutable"

import * as bundles from "bundles"
import * as projects from "projects"
import * as global from "api"
import * as users from "users"

import { LogFn } from "logger"
import { getEditorUrl } from "utils"
import { logEvent } from "analytics"

import * as api from "./api"
import * as monaco from "./monaco"

import { ui } from "./ui/module"
import { debug } from "./debug/module"
import { runProject } from "./runProject"
import { openProject } from "./openProject"
import { importBundles } from "projects/importBundles"
import { computeNpmVersions } from "./computeNpmVersions"
import { importProjects } from "projects/importProjects"
import { getFileTree } from "./getFileTree"
import { getSearches } from "lib/search"

//#region blahh

// hello

//#endregion

// # State
const state: api.State = {
  // ## Sub-module
  debug: debug.state,
  ui: ui.state,
  // ## State
  status: "closed",
  compilationOutput: null,
  original: null,
  project: null,
  expandedFolders: {},
  openedSources: [],
  selectedSources: [],
  monacoLoaded: false
}

const arr = (sources: string | string[]): string[] =>
  typeof sources === "string" ? [sources] : sources

function checkOpen(state: api.State) {
  if (state.status === "closed" || !state.project) {
    throw new Error(`Unexpected status: "${state.status}".`)
  }
}

function expandParents(
  expanded: api.ExpandedFolders,
  path: string
): api.ExpandedFolders {
  const result = { ...expanded }

  const segments = path.split("/")
  segments.pop()

  while (segments.length > 1) {
    result[segments.join("/")] = true
    segments.pop()
  }

  return result
}

const _editor: ModuleImpl<api.State, api.InternalActions> = {
  state,
  // # Actions
  actions: {
    // ## Sub-module
    debug: debug.actions,
    ui: ui.actions,
    // ## Internal
    _bundles: null,
    _projects: null,
    _users: null,
    init: (global: global.Actions) => (state, actions) => {
      actions._users = global.users
      actions._projects = global.projects
      actions._bundles = global.bundles

      monaco.initialize().then(() => {
        const s = actions.getState()
        if (s.projectToOpen) {
          actions._setState(openProject(state, actions, s.projectToOpen))
        }
        actions._setMonacoLoaded()
      })

      // hide the import npm package modal...
      return { ui: { ...state.ui, importNpmPackageModal: null } }
    },
    _setMonacoLoaded: () => ({ monacoLoaded: true }),
    _recomputeFileTree: () => (state, actions) => {
      return {
        fileTree: getFileTree(state)
      }
    },
    _setState: (state: Partial<api.State>) => state,
    getState: () => state => state,
    // ## Project
    open: (project: projects.Project) => (state, actions) => {
      if (state.monacoLoaded) {
        return openProject(state, actions, project)
      }
      return { projectToOpen: project }
    },
    close: () => {
      // reset to default state
      return {
        ...state,
        monacoLoaded: true
      }
    },
    setProjectName: (name: string) => (state, actions) => {
      checkOpen(state)

      const { details, files } = state.project

      return {
        project: {
          details: {
            ...details,
            name
          },
          files
        }
      }
    },
    run: (debug: boolean) => (state, actions): Promise<void> => {
      checkOpen(state)
      return runProject(state, actions, debug)
    },
    importProject: (projectId: string) => (state, actions): Promise<void> => {
      checkOpen(state)

      return actions._projects.fetch(projectId).then(toImport => {
        const id = toImport.details.id
        const name = toImport.details.name
        const mainFile = toImport.details.mainPath

        const project: projects.Project = {
          details: state.project.details,
          files: importProjects(state.project.files, [
            { id, mainFile, name, files: toImport.files }
          ])
        }

        actions._setState({
          project,
          fileTree: getFileTree({
            project,
            expandedFolders: state.expandedFolders
          })
        })
      })
    },
    importNpmPackage: (payload: api.ImportNpmPackagePayload) => (
      state,
      actions
    ): Promise<void> => {
      checkOpen(state)

      return actions._bundles.getFromNpmPackage(payload).then(bundle => {
        const project: projects.Project = {
          details: state.project.details,
          files: importBundles(state.project.files, [bundle])
        }

        actions._setState({
          project,
          fileTree: getFileTree({
            project,
            expandedFolders: state.expandedFolders
          })
        })
      })
    },
    computeImportingNpmPackageVersions: () => (state, actions) => {
      checkOpen(state)
      computeNpmVersions(state, actions)
    },
    saveProject: () => (state, actions): Promise<void> => {
      checkOpen(state)
      if (state.status === "read-only") {
        throw new Error(`Status should not be read-only.`)
      }
      if (state.status === "editing") {
        return actions._projects.save(state.project).then(project => {
          // TODO recompute searches and stuff
          actions._setState({
            original: project,
            project
          })
        })
      } else {
        // save for the first time
        return actions._users
          .getCurrentUser()
          .then(user => {
            const files = state.project.files
            const existing = state.project.details
            const details: projects.ProjectDetails = {
              id: user.id + "_" + guid(), // TODO remove user.id
              name: existing.name,
              hidden: name === "",
              searches: getSearches(existing.name),
              mainPath: existing.mainPath,
              filesUrls: null,
              owner: {
                id: user.id,
                displayName: user.displayName,
                anonymous: user.anonymous
              }
            }

            return actions._projects.save({
              details,
              files
            })
          })
          .then(project => {
            actions._setState({
              project,
              original: project,
              status: "editing"
            })
            replace(`/projects/${project.details.id}`)
          })
      }
    },
    fork: () => (state, actions) => {
      checkOpen(state)
      return actions._users
        .getCurrentUser()
        .then(user => {
          const files = state.project.files
          const name = state.project.details.name
          const details: projects.ProjectDetails = {
            id: user.id + "_" + guid(), // TODO remove user id
            name,
            hidden: true,
            searches: {},
            mainPath: state.project.details.mainPath,
            filesUrls: null,
            owner: {
              id: user.id,
              displayName: user.displayName,
              anonymous: user.anonymous
            }
          }

          return actions._projects.save({
            details,
            files
          })
        })
        .then(project => {
          actions._setState({
            project,
            original: project,
            status: "editing"
          })
          replace(`/projects/${project.details.id}`)
        })
    },
    createFile: (path: string) => (state, actions) => {
      checkOpen(state)

      actions.openFiles({ sources: path })

      const result: Partial<api.State> = {
        project: {
          details: state.project.details,
          files: {
            ...state.project.files,
            [path]: {
              content: "",
              edits: 0
            }
          }
        },
        expandedFolders: expandParents(state.expandedFolders, path)
      }
      result.fileTree = getFileTree(result)
      return result
    },
    deleteFile: (path: string) => (state, actions) => {
      checkOpen(state)

      // TODO implement for folders

      actions.closeFile(path)

      const result: Partial<api.State> = {
        project: {
          details: state.project.details,
          files: {
            ...state.project.files,
            [path]: null
          }
        }
      }
      result.fileTree = getFileTree(result)
      return result
    },
    moveFile: (path: string) => (state, actions) => {
      checkOpen(state)
      // TODO implement
    },
    setFileContent: (payload: api.SetFileContentPayload) => (
      state,
      actions
    ) => {
      checkOpen(state)

      const { path, content } = payload
      const files = state.project.files
      const project: projects.Project = {
        details: state.project.details,
        files: {
          ...files,
          [path]: {
            content: content,
            edits: files[path].edits + 1
          }
        }
      }

      return { project }
    },
    toggleFolder: (path: string) => (state, actions) => {
      const project = state.project
      const folders = state.expandedFolders
      const expandedFolders: api.ExpandedFolders = {
        ...folders,
        [path]: !folders[path]
      }
      const fileTree = getFileTree({ project, expandedFolders })

      return {
        expandedFolders,
        fileTree
      }
    },
    openFiles: (payload: api.OpenFilesPayload) => state => {
      const openedSources = [...state.openedSources]
      const array = arr(payload.sources)
      const selectedSources = state.selectedSources.filter(
        src => !payload.sources.includes(src)
      )

      array.forEach(source => {
        if (!openedSources.includes(source)) {
          openedSources.push(source)
        }

        selectedSources.unshift(source)
      })

      return { openedSources, selectedSources }
    },
    closeFile: (sources: string | string[]) => state => {
      const array = arr(sources)
      const selectedSources = state.selectedSources.filter(
        src => !array.includes(src)
      )
      const openedSources = state.openedSources.filter(
        src => !array.includes(src)
      )
      return { openedSources, selectedSources }
    },
    closeAllFiles: () => {
      return { opened: [], selected: [] }
    },
    selectFile: (source: string) => state => {
      const selectedSources = state.selectedSources.filter(
        src => src !== source
      )
      selectedSources.unshift(source)
      return { selectedSources }
    }
  }
}

export const editor: ModuleImpl<api.State, api.Actions> = _editor
