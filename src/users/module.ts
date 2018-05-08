import firebase from "firebase"

import { ModuleImpl } from "lib/modules"
import { createForm } from "lib/form/module"

import * as api from "./api"
import { logEvent } from "analytics"

interface FirebaseAuthError {
  code: string
  message: string
}

interface Actions extends api.Actions {
  _set(payload: Partial<api.State>)
  _onUserChanged(user: firebase.User)
  _errorOnSignIn(error: FirebaseAuthError)
  _errorOnSignUp(error: FirebaseAuthError)
}

function getDisplayNameFromEmail(email: string = ""): string {
  const segments = email ? email.split("@") : []
  if (segments.length < 1 || segments[0] === "") {
    return "Anonymous User"
  }
  return segments[0]
}

function toUser(u?: firebase.User): api.User | null {
  return u
    ? {
        displayName: u.displayName || getDisplayNameFromEmail(u.email),
        email: u.email,
        emailVerified: u.emailVerified,
        id: u.uid,
        anonymous: u.isAnonymous
      }
    : null
}

const signUpModalForm = createForm({
  email: "",
  password: "",
  confirmPassword: ""
})
const signInForm = createForm({
  email: "",
  password: ""
})
const signUpForm = createForm({
  email: "",
  password: "",
  confirmPassword: ""
})

function checkNotEmpty(state, actions, field) {
  const value = state[field].value
  if (value === "") {
    actions.setField({ field, error: "Must not be empty." })
    return true
  } else {
    actions.setField({ field, error: null })
  }
  return false
}

let googleProvider
let githubProvider

const _users: ModuleImpl<api.State, Actions> = {
  // # State
  state: {
    loading: false,
    signUpForm: signUpForm.state
  },
  // # Actions
  actions: {
    // ## Internal
    _set: payload => payload,
    _onUserChanged: (u: firebase.User) => {
      return {
        user: toUser(u)
      }
    },
    _errorOnSignIn: (err: FirebaseAuthError) => (_, actions) => {
      const { message: error, code } = err
      const field = code === "auth/wrong-password" ? "password" : "email"
      actions.signInModal.setField({ field, error })
    },
    _errorOnSignUp: (err: FirebaseAuthError) => (_, actions) => {
      const { message: error, code } = err
      const field = code === "auth/weak-password" ? "password" : "email"
      actions.signUpModal.setField({ field, error })
    },
    // ## Public
    signUpForm: signUpForm.actions,
    init: () => ({ signInModal: null, signUpModal: null }),
    getState: () => state => state,
    initAuthentication: (listeners: api.AuthListener[]) => (_, actions) => {
      firebase.auth().onAuthStateChanged(u => {
        const user = firebase.auth().currentUser
        actions._onUserChanged(user)
        const user2 = toUser(user)
        listeners.map(listener => listener(user2))
      })
    },
    ensureUser: (): Promise<api.User> => {
      if (firebase.auth().currentUser) {
        return Promise.resolve(toUser(firebase.auth().currentUser))
      }

      return firebase
        .auth()
        .signInAnonymously()
        .then(user => toUser(user))
    },
    signUp: (source: "form" | "modal") => (state, actions): Promise<void> => {
      const form = source === "form" ? state.signUpForm : state.signUpModal
      const formActions =
        source === "form" ? actions.signUpForm : actions.signUpModal
      if (!form) {
        throw new Error("No form in state for " + source)
      }
      let error = checkNotEmpty(form, formActions, "email")
      error = checkNotEmpty(form, formActions, "password") || error
      error = checkNotEmpty(form, formActions, "confirmPassword") || error
      if (error) {
        return
      }

      const email = form.email.value
      const password = form.password.value
      const confirmPassword = form.confirmPassword.value
      if (password !== confirmPassword) {
        formActions.setField({
          field: "confirmPassword",
          error: "Does not match the password."
        })
        return
      }

      const auth = firebase.auth()
      const currentUser = auth.currentUser
      if (currentUser && currentUser.isAnonymous) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          email,
          password
        )
        // firebase doesn't really return a promise here...
        // we have to do it ourselves or we trash the state...
        return new Promise(resolve => {
          currentUser
            .linkAndRetrieveDataWithCredential(credential)
            .then(() => {
              actions.hideSignUpModal()
              logEvent("signup", {
                event_category: "users",
                event_label: "SignupEmail"
              })

              // this does not trigger onAuthStateChanged, do it manually
              actions._onUserChanged(auth.currentUser)
              resolve()
            })
            .catch(actions._errorOnSignUp)
        })
      } else {
        return auth
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            actions.hideSignUpModal()
            logEvent("signup", {
              event_category: "users",
              event_label: "SignupEmail"
            })
          })
          .catch(actions._errorOnSignUp)
      }
    },
    signIn: () => (state, actions): Promise<void> => {
      if (!state.signInModal) {
        throw new Error("No signInModal in state.")
      }
      const form = state.signInModal
      let error = checkNotEmpty(form, actions.signInModal, "email")
      error = checkNotEmpty(form, actions.signInModal, "password") || error
      if (error) {
        return
      }

      const email = form.email.value
      const password = form.password.value

      return firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(val => {
          actions.hideSignInModal()
          logEvent("login", {
            event_category: "users",
            event_label: "LoginEmail"
          })
        })
        .catch(actions._errorOnSignIn)
    },
    signInWithGoogle: () => (state, actions) => {
      if (!googleProvider) {
        googleProvider = new firebase.auth.GoogleAuthProvider()
      }
      return firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(() =>
          logEvent("login", {
            event_category: "users",
            event_label: "LoginGoogle"
          })
        )
    },
    signInWithGithub: () => (state, actions) => {
      if (!githubProvider) {
        githubProvider = new firebase.auth.GithubAuthProvider()
      }
      return firebase
        .auth()
        .signInWithPopup(githubProvider)
        .then(() =>
          logEvent("login", {
            event_category: "users",
            event_label: "LoginGithub"
          })
        )
    },
    signOut: (): Promise<void> => {
      return firebase.auth().signOut()
    },
    // ### Sign In
    signInModal: signInForm.actions,
    showSignInModal: () => ({ signInModal: signInForm.state }),
    hideSignInModal: () => ({ signInModal: null }),
    // ### Sign Up
    signUpModal: signUpModalForm.actions,
    showSignUpModal: () => ({ signUpModal: signUpModalForm.state }),
    hideSignUpModal: () => ({ signUpModal: null })
  }
}
export const users: ModuleImpl<api.State, api.Actions> = _users
