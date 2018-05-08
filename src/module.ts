import { addListener, create as createRouter, replace } from "lib/router"
import { initializeFirebase } from "lib/firebase"
import { ModuleImpl } from "lib/modules"

import { State, Actions, FetchProjectPayload } from "./api"
import { isLoading } from "./selectors"
import { bundles } from "bundles/module"
import { editor } from "editor/module"
import { logger } from "logger/module"
import { createProjects } from "projects/module"
import { createSearch } from "lib/search/module"
import { ui } from "ui/module"
import { users } from "users/module"
import { AuthListener } from "users"
import { COLLECTION, ProjectOwner } from "projects"
import { getWords } from "lib/search"
import { getProjectsStore } from "getProjectsStore"
import { createProject } from "./createProject"
import { logConfig, logEvent } from "analytics"

const router = createRouter()
const projectsStore = getProjectsStore()
const projects = createProjects(projectsStore)
const search = createSearch([{ name: "projects" }])

export const module: ModuleImpl<State, Actions> = {
  state: {
    bundles: bundles.state,
    editor: editor.state,
    logger: logger.state,
    projects: projects.state,
    router: router.state,
    search: search.state,
    ui: ui.state,
    users: users.state
  },
  actions: {
    bundles: bundles.actions,
    editor: editor.actions,
    logger: logger.actions,
    projects: projects.actions,
    router: router.actions,
    search: search.actions,
    ui: ui.actions,
    users: users.actions,

    getState: () => state => state,
    init: () => (_, actions) => {
      initializeFirebase()

      actions.router.init()
      actions.logger.init(actions)
      actions.bundles.init(actions)
      actions.users.init(actions)
      actions.projects.init(actions)
      actions.search.init(actions)
      actions.editor.init(actions)

      const authListener: AuthListener = user => {
        const state = actions.editor.getState()
        const project = state.project
        // TODO fix this with anonymous login and everything...
        // if (
        //   user &&
        //   project &&
        //   (project.details.owner.id === user.id)
        // ) {
        //   // currently editing an artifact locally, save it on login
        //   actions.logger.log(
        //     actions.editor.setOwner({
        //       id: user.id,
        //       displayName: user.displayName
        //     })
        //   )
        // } else if (!user && project && state.status === "editing") {
        //   // currently editing own artifact, switch to local mode.
        //   actions.logger.log(actions.editor.setOwner(null))
        // }
      }
      actions.users.initAuthentication([authListener])

      const searchFn = (text, range) => {
        if (!text || text.trim() === "") {
          return projectsStore.query({
            collection: COLLECTION,
            where: [{ attribute: "hidden", op: "==", value: false }],
            first: range.value,
            limit: range.count
          })
        }

        const attribute = "searches." + getWords(text).join("-")
        return projectsStore.query({
          collection: COLLECTION,
          where: [{ attribute, op: ">", value: 0 }],
          orderBy: { attribute, descending: true },
          first: range.value,
          limit: range.count
        })
      }
      actions.search.setSearchFn(searchFn)
      actions.editor.ui.importProjectModal.search.setSearchFn(searchFn)

      addListener("projects/:id", match => {
        const id = match.params.id
        if (actions.getState().editor.project) {
          return
        }
        // when /projects/new, create
        if (id === "new") {
          createProject(actions.getState(), actions, "hyperapp")
        } else {
          actions.logger.log(actions.fetchProject({ id, open: true }))
        }
      })

      addListener("*", match => {
        logConfig({ page_path: match.location })
      })
    },
    createProject: () => (state, actions) => {
      const template = state.ui.createProjectModal
        ? state.ui.createProjectModal.template
        : null
      if (!template) {
        return null
      }
      actions.ui.closeCreateProjectModal()

      return createProject(state, actions, template)
    },
    fetchProject: (payload: FetchProjectPayload) => (state, actions) => {
      if (isLoading(state)) {
        return
      }
      const edited = state.editor.project
      if (edited && edited.details.id === payload.id) {
        return
      }

      return actions.projects.fetch(payload.id).then(project => {
        if (payload.open) {
          actions.editor.open(project)
        }

        return project
      })
    }
  }
}
