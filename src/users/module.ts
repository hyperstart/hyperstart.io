import firebase from "firebase"

import { ModuleImpl } from "lib/modules"

import * as api from "./api"

interface Actions extends api.Actions {
  _set(payload: Partial<api.State>)
  _setError(error?: api.Error)
  _onUserChanged(user: firebase.User)
}

const auth = firebase.auth()

function toUser(user?: firebase.User): api.User | null {
  return user
    ? {
        displayName: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.uid
      }
    : null
}

const _users: ModuleImpl<api.State, Actions> = {
  // # State
  state: {
    authenticated: false,
    loading: false
  },
  // # Actions
  actions: {
    // ## Internal
    _set: payload => payload,
    _setError: error => ({ error }),
    _onUserChanged: (user: firebase.User) => {
      return {
        user,
        authenticated: !!user,
        checked: true
      }
    },
    // ## Public
    init: () => {},
    getState: () => state => state,
    initAuthentication: (listeners: api.Listener[]) => (_, actions) => {
      auth.onAuthStateChanged(user => {
        actions._onUserChanged(user)
        const user2 = toUser(user)
        listeners.map(listener => listener(user2))
      })
    },
    resetIdentity: () => {
      return {
        user: null,
        error: null
      }
    },
    signUp: (payload: api.SignUpPayload) => (_, actions): Promise<void> => {
      actions._set({ error: null })
      return auth
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .catch(actions._setError)
    },
    signIn: (payload: api.SignInPayload) => (_, actions): Promise<void> => {
      actions._set({ error: null })
      return auth
        .signInWithEmailAndPassword(payload.email, payload.password)
        .catch(actions._setError)
    },
    signOut: (): Promise<void> => {
      return auth.signOut()
    }
  }
}
export const users: ModuleImpl<api.State, api.Actions> = _users
