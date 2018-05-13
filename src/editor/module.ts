import { guid, getErrorMessage, debounce } from "lib/utils"
import { ModuleImpl } from "lib/modules"
import { local } from "lib/store/local"
import { replace, push } from "lib/router"
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
import { panes } from "./panes/module"
import { runProject } from "./runProject"
import { openProject } from "./openProject"
import { importBundles } from "projects/importBundles"
import { computeNpmVersions } from "./computeNpmVersions"
import { importProjects } from "projects/importProjects"
import { getFileTree } from "./getFileTree"
import { getSearches, normalize } from "lib/search"
import { createModel, deleteModels, configureFor } from "./monaco"
import { getProjectOwner } from "projects/getProjectOwner"
import { hasCurrentEditor, executeAction } from "./monacoActions"
import { canExecuteMonacoAction } from "./selectors"

// # State
const state: api.State = {
  // ## Sub-module
  debug: debug.state,
  panes: panes.state,
  ui: ui.state,
  // ## State
  status: "closed",
  compilationOutput: null,
  original: null,
  project: null,
  expandedFolders: {},
  monacoLoaded: false
}

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
    panes: panes.actions,
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
    setProjectName: (name: string = "") => (state, actions) => {
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

        configureFor(project.files, false)
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

        configureFor(project.files, false)
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
        let toSave = state.project
        if (toSave.details !== state.original.details) {
          logEvent("rename_project", {
            event_category: "project",
            event_label: "Rename"
          })
          const name = normalize(toSave.details.name)
          toSave = {
            details: {
              ...toSave.details,
              name,
              hidden: name !== "",
              searches: getSearches(name)
            },
            files: toSave.files
          }
        }
        return actions._projects.save(toSave).then(project => {
          // TODO recompute searches and stuff
          actions._setState({
            original: project,
            project
          })
        })
      } else {
        // save for the first time
        return actions._users
          .ensureUser()
          .then(user => {
            const files = state.project.files
            const existing = state.project.details
            const name = normalize(existing.name)
            const details: projects.ProjectDetails = {
              id: guid(),
              name,
              hidden: name === "",
              searches: getSearches(name),
              mainPath: existing.mainPath,
              filesUrls: null,
              owner: getProjectOwner(user)
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
        .ensureUser()
        .then(user => {
          const files = state.project.files
          const name = normalize(state.project.details.name)
          const details: projects.ProjectDetails = {
            id: guid(),
            name,
            hidden: true,
            searches: {},
            mainPath: state.project.details.mainPath,
            filesUrls: null,
            owner: getProjectOwner(user)
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

          logEvent("fork_project", {
            event_category: "project",
            event_label: "Fork"
          })
        })
    },
    onUserChanged: (user: users.User) => (state, actions) => {
      switch (state.status) {
        case "editing":
          if (!user) {
            // logged out -> switch to read-only mode
            actions._setState({ status: "read-only" })
          } else if (user.linkedTo) {
            // we were editing before (i.e. with an anonymous user)
            // and the account was linked -> we must update the owner of the project
            actions._setState({
              project: {
                details: {
                  ...state.project.details,
                  owner: getProjectOwner(user)
                },
                files: state.project.files
              }
            })
            return actions.saveProject()
          } else if (user && !user.linkedTo) {
            // we were editing before (i.e. with an anonymous user)
            // and the account was not linked -> we must fork the project
            return actions.fork()
          }
        case "read-only":
          if (!user) {
            return
          }

          // check if we are the project owner now.
          const project: any = state.project || {}
          const details: any = project.details || {}
          const owner = details.owner
          if (user.id === owner.id) {
            actions._setState({
              status: "editing"
            })
          }
        case "local-only":
        case "closed":
        // nothing to do
      }
    },
    createFile: (path: string) => (state, actions) => {
      checkOpen(state)

      actions.ui.closeCreateFileModal()

      createModel("", path)
      actions.panes.openFiles(path)

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

      actions.ui.closeDeleteFileModal()

      const node = state.fileTree[path]
      const existing = state.project.files

      let files: projects.Files
      const toClose: string[] = []
      if (!node) {
        throw new Error(`File not found: ${path}`)
      } else if (node.type === "file") {
        files = {
          ...existing,
          [path]: null
        }
        toClose.push(path)
      } else {
        files = {}
        Object.keys(existing).forEach(filePath => {
          // for null
          if (!existing[filePath]) {
            return
          }
          if (!filePath.startsWith(path)) {
            files[filePath] = existing[filePath]
          } else {
            toClose.push(filePath)
          }
        })
      }

      deleteModels(toClose)
      actions.panes.closeFiles(toClose)

      const result: Partial<api.State> = {
        project: {
          details: state.project.details,
          files
        },
        expandedFolders: state.expandedFolders
      }
      result.fileTree = getFileTree(result)
      return result
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
    previewFile: (fileOrUrl: string | api.FileNode | null) => (
      state,
      actions
    ) => {
      checkOpen(state)

      // cancelling preview
      if (!fileOrUrl) {
        push(getEditorUrl(state.project.details))
        return {}
      }

      if (typeof fileOrUrl !== "string") {
        logEvent("screen_view", { screen_name: "Preview of " + fileOrUrl.name })
      }

      push(
        typeof fileOrUrl === "string"
          ? fileOrUrl
          : getEditorUrl(state.project.details) + fileOrUrl.path
      )
    },
    render: () => ({}),
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
    executeAction: (action: api.MonacoAction) => (state): Promise<void> => {
      if (!canExecuteMonacoAction(state)) {
        return Promise.reject(
          "Cannot currently execute an action: no monaco editor found or no source tab selected."
        )
      }
      return executeAction(action)
    }
  }
}

export const editor: ModuleImpl<api.State, api.Actions> = _editor
