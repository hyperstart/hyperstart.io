import { ModuleImpl } from "lib/modules"
import { local } from "lib/store/local"
import { replace } from "lib/router"
import { set } from "lib/immutable"
import { guid } from "lib/utils"

import * as projects from "projects"
import * as global from "api"
import * as users from "users"
import { createProjects } from "projects/module"
import { LogFn } from "logger"

import * as api from "./api"
import * as monaco from "./monaco"
import { ui } from "./ui/module"
import { debug } from "./debug/module"
import { configureFor, deleteModels } from "./monaco"
import { sources } from "./sources/module"
import { openProject } from "./openProject"
import { getDirtySources } from "./selectors"
import { runProject } from "./runProject"
import { getEditorUrl } from "utils"
import { logEvent } from "analytics"

function copyFiles(files: projects.FileTree): projects.Files {
  const results: projects.Files = {}

  Object.keys(files.byId).forEach(id => {
    const file: any = files.byId[id]
    results[id] = {
      id,
      type: file.type,
      name: file.name
    }
    if (file.parent) {
      results[id].parent = file.parent
    }
    if (typeof file.content === "string") {
      results[id].content = file.content
    }
    if (file.url) {
      results[id].url = file.url
    }
    if (file.projectId) {
      results[id].projectId = file.projectId
    }
  })

  return results
}

function updateProject(
  actions: Actions,
  project: projects.Project,
  status: api.Status
) {
  const state = actions.getState()
  const files = projects.getFileTree(project.files)
  configureFor(files, false)
  actions._setState({
    files,
    project: project.details,
    status
  })
}

const localStore = createProjects(local())
let usersActions: users.Actions
let projectsActions: projects.Actions
let projectToOpen

function getProjects(state: api.State, actions: api.Actions): projects.Actions {
  if (state.status === "editing") {
    return projectsActions
  }

  return actions.localStore
}

// internal actions
interface Actions extends api.Actions {
  _setMonacoLoaded()
  _setState(state: Partial<api.State>)
}

const _editor: ModuleImpl<api.State, Actions> = {
  // # State
  state: {
    // ## Sub-module
    debug: debug.state,
    localStore: localStore.state,
    sources: sources.state,
    ui: ui.state,
    // ## State
    files: { byId: {}, byPath: {}, roots: [] },
    status: "closed"
  },
  // # Actions
  actions: {
    // ## Sub-module
    debug: debug.actions,
    localStore: localStore.actions,
    sources: sources.actions,
    ui: ui.actions,
    // ## Internal
    init: (globalActions: global.Actions) => (state, actions) => {
      usersActions = globalActions.users
      projectsActions = globalActions.projects
      monaco.initialize().then(() => {
        actions._setMonacoLoaded()
        if (projectToOpen) {
          const user = usersActions.getState().user
          actions._setState(
            openProject(state, actions, projectToOpen, user ? user.id : null)
          )
        }
      })
    },
    _setMonacoLoaded: () => ({ monacoLoaded: true }),
    _setState: (state: Partial<api.State>) => state,
    getState: () => state => state,
    // ## Project
    open: (project: projects.Project) => (state, actions) => {
      if (state.monacoLoaded) {
        const user = usersActions.getState().user
        return openProject(state, actions, project, user ? user.id : null)
      } else {
        projectToOpen = project
      }
    },
    close: () => {
      return {
        compilationOutput: null,
        debug: debug.state,
        files: null,
        project: null,
        sources: sources.state,
        status: "closed",
        ui: ui.state
      }
    },
    submitEdits: () => (state, actions): Promise<void> => {
      const form = state.ui.editForm
      const formActions = actions.ui.editForm
      const id = state.project.id
      const name = form["name"].value
      if (!name || name.trim() === "") {
        formActions.setField({
          field: "name",
          error: "Name cannot be empty."
        })
        return Promise.reject("Validation error(s).")
      }

      formActions.setField({ field: "name", error: null })
      actions._setState({ status: "loading" })
      return projectsActions
        .update({
          id,
          name
        })
        .then(project => {
          actions.ui.stopEdit()
          actions._setState({
            project: { ...project.details },
            status: "editing"
          })
        })
        .catch(e => {
          actions._setState({
            status: "error"
          })
          throw e
        })
    },
    setOwner: (owner: projects.Owner) => (state, actions): Promise<void> => {
      const currentId = state.project.id

      if (!owner) {
        actions._setState({ status: "read-only" })
        return projectsActions
          .fetch(currentId)
          .then(actions.localStore.save)
          .then(() => {})
      }

      const id = currentId.startsWith(owner.id)
        ? currentId
        : owner.id + "-" + guid()

      const project: projects.Project = {
        details: {
          ...state.project,
          id,
          owner
        },
        files: copyFiles(state.files),
        status: {}
      }

      actions._setState({ status: "loading" })
      return projectsActions
        .save(project)
        .then(() => {
          updateProject(actions, project, "editing")
          replace("/projects/" + id)
        })
        .catch(e => {
          actions._setState({ status: "error" })
          throw e
        })
    },
    saveAllSources: () => (state, actions): Promise<void> => {
      if (state.status !== "editing") {
        return Promise.resolve()
      }
      const files: any = state.files.byId
      const projectId = state.project.id
      const update: projects.UpdateFilesPayload = {
        id: projectId,
        files: getDirtySources(state).map(id => ({
          id,
          content: files[id].content
        }))
      }

      actions._setState({ status: "loading" })
      return projectsActions
        .updateFiles(update)
        .then(() => {
          updateProject(
            actions,
            projectsActions.getState()[projectId],
            "editing"
          )
        })
        .catch(e => {
          actions._setState({ status: "error" })
          throw e
        })
    },
    run: (debug: boolean) => (state, actions): Promise<void> => {
      return runProject(state, actions, debug)
    },
    importProjects: (projects: string[]) => (state, actions): Promise<void> => {
      const id = state.project.id
      actions._setState({ status: "loading" })
      return Promise.all(projects.map(projectsActions.fetch))
        .then(projects => {
          const payload: projects.ImportProjectsPayload = {
            id,
            projects: projects.map(project => ({
              name: project.details.name,
              files: project.files
            }))
          }
          return getProjects(state, actions).importProjects(payload)
        })
        .then(result => {
          updateProject(
            actions,
            getProjects(state, actions).getState()[id],
            state.status
          )
        })
        .catch(e => {
          actions._setState({ status: "error" })
          throw e
        })
    },
    // ## Files
    toggleFileExpanded: (path: string) => (state, actions) => {
      const id = state.files.byPath[path]
      if (!id) throw new Error("no folder at path " + path)
      const folder = state.files.byId[id] as projects.FolderNode
      if (!folder) throw new Error("no folder at path " + path)

      const files = set(state.files, ["byId", id, "expanded"], !folder.expanded)
      return { files }
    },
    createFile: (payload: api.CreateFilePayload) => (
      state,
      actions
    ): Promise<void> => {
      const file: projects.File = {
        id: guid(),
        type: payload.type,
        name: payload.name
      }
      if (payload.parent) {
        file.parent = payload.parent.id
      }
      if (payload.type === "file") {
        file.content = ""
      }
      const id = state.project.id

      actions._setState({ status: "loading" })
      return getProjects(state, actions)
        .addFiles({ id, files: [file] })
        .then(result => {
          updateProject(
            actions,
            getProjects(state, actions).getState()[id],
            state.status
          )
          if (payload.type === "file") {
            actions.sources.open({ sources: file.id })
          }
        })
        .catch(e => {
          actions._setState({ status: "error" })
          throw e
        })
    },
    deleteFile: (file: projects.FileNode) => (
      state,
      actions
    ): Promise<void> => {
      const id = state.project.id
      const files = [file.id]
      if (file.type === "folder") {
        projects.getChildrenRecursive(state.files, file, files)
      }

      const paths = files
        .map(id => state.files.byId[id])
        .filter(file => file.type === "file")
        .map(file => file.path)

      actions._setState({ status: "loading" })
      return getProjects(state, actions)
        .deleteFiles({ id, files })
        .then(() => {
          updateProject(
            actions,
            getProjects(state, actions).getState()[id],
            state.status
          )
          actions.sources.close(files)
          deleteModels(paths)
        })
        .catch(e => {
          actions._setState({ status: "error" })
          throw e
        })
    },
    previewFile: (fileOrUrl: string | projects.FileNode) => (
      state,
      actions
    ) => {
      // cancelling preview
      if (!fileOrUrl) {
        replace(getEditorUrl(state.project))
        return {}
      }

      if (typeof fileOrUrl !== "string") {
        logEvent("screen_view", { screen_name: "Preview of " + fileOrUrl.path })
      }

      replace(
        typeof fileOrUrl === "string"
          ? fileOrUrl
          : getEditorUrl(state.project) + fileOrUrl.path
      )
      return {}
    },
    setFileContent: (source: api.SetFileContentPayload) => (state, actions) => {
      const id = state.files.byPath[source.path]
      if (!id) {
        throw new Error("No source found at path " + source.path)
      }

      const files = set(state.files, ["byId", id, "content"], source.content)
      return { files }
    }
  }
}

export const editor: ModuleImpl<api.State, api.Actions> = _editor
