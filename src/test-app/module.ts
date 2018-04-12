import firebase from "firebase"

import { ModuleImpl } from "lib/modules"
import { firestore } from "lib/store/firestore"
import { initializeFirebase } from "lib/firebase"
import { create as createRouter, addListener } from "lib/router"

import * as api from "./api"
import { getErrorMessage, guid } from "lib/utils"

function toUser(user?: firebase.User): api.User | null {
  return user
    ? {
        name: user.displayName || user.email,
        email: user.email,
        id: user.uid
      }
    : null
}

const router = createRouter()

// private actions
interface Actions extends api.Actions {
  _setUser(user: firebase.User)
  _setUsers(users: api.User[])
  _addUser(user: any)
  _setProjects(projects: api.Project[])
  _addProject(project: any)
  _addProjects(project: any[])
  _onError(error)
}

function _create(): ModuleImpl<api.State, Actions> {
  // firebase stuff
  initializeFirebase()
  const store = firestore()
  const googleProvider = new firebase.auth.GoogleAuthProvider()

  return {
    state: {
      router: router.state,
      users: [],
      projects: []
    },
    actions: {
      // submodules
      router: router.actions,
      // internal
      _setUser: (user: firebase.User) => {
        return { user: toUser(user) }
      },
      _onError: e => {
        return { error: getErrorMessage(e) }
      },
      _setProjects: (projects: any[]) => {
        return { projects }
      },
      _addProject: (project: api.Project) => state => {
        for (let p of state.projects) {
          if (p.id === project.id) {
            return
          }
        }
        return { projects: state.projects.concat(project) }
      },
      _addProjects: (projects: api.Project[]) => (state, actions) => {
        projects.forEach(actions._addProject)
      },
      _setUsers: (users: any[]) => {
        return { users }
      },
      _addUser: (user: api.User) => state => {
        for (let u of state.users) {
          if (u.id === user.id) {
            return
          }
        }
        return { users: state.users.concat(user) }
      },
      // external
      init: () => (state, actions) => {
        actions.router.init()

        firebase.auth().onAuthStateChanged(actions._setUser)
        addListener(
          "/:id",
          match => {
            const id = match.params.id
            if (id === "users") {
              actions.fetchUsers()
            } else if (id === "projects") {
              actions.fetchProjects()
            } else {
              actions.fetchUser(id)
            }
          },
          true
        )
      },
      login: () => (state, actions) => {
        firebase
          .auth()
          .signInWithPopup(googleProvider)
          .catch(actions._onError)
      },
      logout: () => (state, actions) => {
        firebase
          .auth()
          .signOut()
          .catch(actions._onError)
      },
      fetchProjects: () => (state, actions) => {
        store.query({ collection: "projects" }).then(actions._setProjects)
      },
      fetchProject: (payload: api.FetchProjectPayload) => (state, actions) => {
        store
          .query({
            collection: "projects",
            where: [
              { attribute: "name", op: "==", value: payload.project },
              { attribute: "owner", op: "==", value: payload.user }
            ]
          })
          .then(projects => actions._addProject(projects[0]))
      },
      fetchUsers: () => (state, actions) => {
        store.query({ collection: "users" }).then(actions._setUsers)
      },
      fetchUser: (value: string) => (state, actions) => {
        store
          .query({
            collection: "users",
            where: [{ attribute: "name", op: "==", value }]
          })
          .then(users => actions._addUser(users[0]))
          .then(() =>
            store
              .query({
                collection: "projects",
                where: [{ attribute: "owner", op: "==", value }]
              })
              .then(actions._addProjects)
          )
      },
      createUser: () => (state, actions) => {
        const id = guid()
        const name = "user" + state.users.length
        const user: api.User = {
          id,
          email: name + "@test.com",
          name
        }
        store
          .update({
            toSet: [
              {
                id,
                collection: "users",
                document: user
              }
            ]
          })
          .then(() => actions._addUser(user))
      },
      createProject: (owner: string) => (state, actions) => {
        const id = guid()
        const name = "project" + state.projects.length
        const project: api.Project = {
          id,
          owner,
          name
        }
        store
          .update({
            toSet: [
              {
                id: owner + "___" + name,
                collection: "projects",
                document: project
              }
            ]
          })
          .then(() => actions._addProject(project))
      }
    }
  }
}
export const create: () => ModuleImpl<api.State, api.Actions> = _create
