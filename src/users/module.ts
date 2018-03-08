import firebase from "firebase"

import { ModuleImpl } from "lib/modules"

import * as api from "./api"

declare const firebaseui

let ui

const toUser = (user?: firebase.User): api.User | null => {
  return user
    ? {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.uid
      }
    : null
}

export const users: ModuleImpl<api.State, api.Actions> = {
  state: {
    usersById: {}
  },
  actions: {
    init: () => {},
    getState: () => state => state,
    initFirebase: (listeners: api.AuthenticationListener[]) => (
      state,
      actions
    ) => {
      firebase.auth().onAuthStateChanged(user => {
        actions.setUser(user)
        const user2 = toUser(user)
        listeners.forEach(listener => listener(user2))
      })

      ui = new firebaseui.auth.AuthUI(firebase.auth())
    },
    setUser: (user?: firebase.User) => state => {
      if (user) {
        const currentUser = toUser(user)
        return {
          currentUser,
          usersById: { ...state.usersById, [currentUser.id]: currentUser }
        }
      }

      return { currentUser: null }
    },
    logout: () => (state, actions): Promise<void> => {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          actions.setUser(null)
        })
    }
  }
}
