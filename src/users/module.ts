import firebase from "firebase"

import { ModuleImpl } from "lib/modules"
import { createForm } from "lib/form/module"

import * as api from "./api"
import { logEvent } from "analytics"
import { isNullOrUndefined } from "util"

function getDisplayNameFromEmail(email: string = ""): string {
  const segments = email ? email.split("@") : []
  if (segments.length < 1 || segments[0] === "") {
    return "Anonymous User"
  }
  return segments[0]
}

function toUser(u: firebase.User | null, linkedTo: api.User): api.User | null {
  return u
    ? {
        displayName: u.displayName || getDisplayNameFromEmail(u.email),
        email: u.email,
        emailVerified: u.emailVerified,
        id: u.uid,
        anonymous: u.isAnonymous,
        linkedTo
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

function signInWithProvider(
  previousUser: api.User,
  provider: firebase.auth.AuthProvider,
  eventLabel: string
): Promise<void> {
  const auth = firebase.auth()
  const currentUser = auth.currentUser

  // upgrading an anonymous user
  if (currentUser && currentUser.isAnonymous) {
    // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
    return new Promise((resolve, reject) => {
      currentUser
        .linkWithPopup(provider)
        .then(() => {
          logEvent("login", {
            event_category: "users",
            event_label: eventLabel
          })

          onUserChanged(auth.currentUser, previousUser)
          resolve()
        })
        .catch(e => {
          console.log(e.code)
          if (e.code === "auth/credential-already-in-use") {
            // There is already an anonymous account linked to those credentials.
            // in this case, the only thing we can do is to signup the user normally.
            auth
              .signInWithPopup(provider)
              .then(() => {
                logEvent("login", {
                  event_category: "users",
                  event_label: eventLabel
                })

                onUserChanged(auth.currentUser, null)
                resolve()
              })
              .catch(e => {
                reject(e)
              })
            return
          }
          reject(e)
        })
    })
  } else {
    // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
    return new Promise((resolve, reject) => {
      auth
        .signInWithPopup(provider)
        .then(() => {
          logEvent("login", {
            event_category: "users",
            event_label: eventLabel
          })

          onUserChanged(auth.currentUser, null)
          resolve()
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}

let googleProvider
let githubProvider
let onUserChanged: (user: firebase.User, linkedTo: api.User) => api.User

const _users: ModuleImpl<api.State, api.InternalActions> = {
  // # State
  state: {
    loading: false,
    signUpForm: signUpForm.state
  },
  // # Actions
  actions: {
    // ## Internal
    _set: payload => payload,
    _errorOnSignIn: (err: api.FirebaseAuthError) => (_, actions) => {
      const { message: error, code } = err
      const field = code === "auth/wrong-password" ? "password" : "email"
      actions.signInModal.setField({ field, error })
    },
    _errorOnSignUp: (err: api.FirebaseAuthError) => (_, actions) => {
      const { message: error, code } = err
      const field = code === "auth/weak-password" ? "password" : "email"
      actions.signUpModal.setField({ field, error })
    },
    // ## Public
    signUpForm: signUpForm.actions,
    init: () => ({ signInModal: null, signUpModal: null }),
    getState: () => state => state,
    initAuthentication: (listeners: api.AuthListener[]) => (_, actions) => {
      onUserChanged = (firebaseUser, linkedTo) => {
        const previous = actions.getState().user || null
        const user = toUser(firebaseUser, linkedTo)
        actions._set({ user })
        listeners.map(listener => {
          listener(user, previous)
        })
        return user
      }
    },
    ensureUser: () => (state): Promise<api.User> => {
      if (state.user) {
        return Promise.resolve(state.user)
      }

      return firebase
        .auth()
        .signInAnonymously()
        .then(user => onUserChanged(user, null))
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
        // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
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
              onUserChanged(auth.currentUser, state.user)
              resolve()
            })
            .catch(e => {
              actions._errorOnSignUp(e)
              resolve()
            })
        })
      } else {
        // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
        return new Promise(resolve => {
          auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
              actions.hideSignUpModal()
              logEvent("signup", {
                event_category: "users",
                event_label: "SignupEmail"
              })

              onUserChanged(auth.currentUser, null)
              resolve()
            })
            .catch(e => {
              actions._errorOnSignUp(e)
              resolve()
            })
        })
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

      const auth = firebase.auth()
      const currentUser = auth.currentUser
      if (currentUser && currentUser.isAnonymous) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          email,
          password
        )
        // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
        return new Promise(resolve => {
          currentUser
            .reauthenticateAndRetrieveDataWithCredential(credential)
            .then(() => {
              actions.hideSignInModal()
              logEvent("login", {
                event_category: "users",
                event_label: "LoginEmail"
              })

              onUserChanged(auth.currentUser, state.user)
              resolve()
            })
            .catch(e => {
              if (e.code === "auth/user-mismatch") {
                // There is already an anonymous account linked to those credentials.
                // in this case, the only thing we can do is to signup the user normally.
                auth
                  .signInWithEmailAndPassword(email, password)
                  .then(val => {
                    actions.hideSignInModal()
                    logEvent("login", {
                      event_category: "users",
                      event_label: "LoginEmail"
                    })

                    onUserChanged(auth.currentUser, null)
                    resolve()
                  })
                  .catch(e => {
                    actions._errorOnSignIn(e)
                    resolve()
                  })
                return
              }
              actions._errorOnSignIn(e)
              resolve()
            })
        })
      } else {
        // firebase doesn't actually return a promise, we have to do it ourselves or we trash the state...
        return new Promise(resolve => {
          auth
            .signInWithEmailAndPassword(email, password)
            .then(val => {
              actions.hideSignInModal()
              logEvent("login", {
                event_category: "users",
                event_label: "LoginEmail"
              })
              onUserChanged(auth.currentUser, null)
              resolve()
            })
            .catch(e => {
              actions._errorOnSignIn(e)
              resolve()
            })
        })
      }
    },
    signInWithGoogle: () => (state, actions) => {
      if (!googleProvider) {
        googleProvider = new firebase.auth.GoogleAuthProvider()
      }

      return signInWithProvider(state.user, googleProvider, "LoginGoogle")
    },
    signInWithGithub: () => (state, actions) => {
      if (!githubProvider) {
        githubProvider = new firebase.auth.GithubAuthProvider()
      }

      return signInWithProvider(state.user, githubProvider, "LoginGithub")
    },
    signOut: (): Promise<void> => {
      return firebase
        .auth()
        .signOut()
        .then(() => {
          onUserChanged(null, null)
        })
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
