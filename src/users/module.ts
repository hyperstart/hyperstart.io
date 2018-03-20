import firebase from "firebase"

import { ModuleImpl } from "lib/modules"
import { createForm } from "lib/form/module"

import * as api from "./api"

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
  const segments = email.split("@")
  if (segments.length < 1 || segments[0] === "") {
    return "Anonymous"
  }
  return segments[0]
}

function toUser(user?: firebase.User): api.User | null {
  return user
    ? {
        displayName: user.displayName || getDisplayNameFromEmail(user.email),
        email: user.email,
        emailVerified: user.emailVerified,
        id: user.uid
      }
    : null
}

const signUpForm = createForm({
  email: "",
  password: "",
  confirmPassword: ""
})
const signInForm = createForm({
  email: "",
  password: ""
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

const _users: ModuleImpl<api.State, Actions> = {
  // # State
  state: {
    loading: false
  },
  // # Actions
  actions: {
    // ## Internal
    _set: payload => payload,
    _onUserChanged: (user: firebase.User) => {
      return {
        user: toUser(user),
        authenticated: !!user,
        checked: true
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
    init: () => ({ signInModal: null, signUpModal: null }),
    getState: () => state => state,
    initAuthentication: (listeners: api.AuthListener[]) => (_, actions) => {
      firebase.auth().onAuthStateChanged(user => {
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
    signUp: () => (state, actions): Promise<void> => {
      if (!state.signUpModal) {
        throw new Error("No signUpModal in state.")
      }
      const form = state.signUpModal
      let error = checkNotEmpty(form, actions.signUpModal, "email")
      error = checkNotEmpty(form, actions.signUpModal, "password") || error
      error =
        checkNotEmpty(form, actions.signUpModal, "confirmPassword") || error
      if (error) {
        return
      }

      const email = form.email.value
      const password = form.password.value
      const confirmPassword = form.confirmPassword.value
      if (password !== confirmPassword) {
        actions.signUpModal.setField({
          field: "confirmPassword",
          error: "Does not match the password."
        })
        return
      }

      return firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          actions.hideSignUpModal()
        })
        .catch(actions._errorOnSignUp)
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
        .then(() => {
          actions.hideSignInModal()
        })
        .catch(actions._errorOnSignIn)
    },
    signInWithGoogle: () => (state, actions) => {
      if (!googleProvider) {
        googleProvider = new firebase.auth.GoogleAuthProvider()
      }
      return firebase.auth().signInWithPopup(googleProvider)
    },
    signOut: (): Promise<void> => {
      return firebase.auth().signOut()
    },
    // ### Sign In
    signInModal: signInForm.actions,
    showSignInModal: () => ({ signInModal: signInForm.state }),
    hideSignInModal: () => ({ signInModal: null }),
    // ### Sign Up
    signUpModal: signUpForm.actions,
    showSignUpModal: () => ({ signUpModal: signUpForm.state }),
    hideSignUpModal: () => ({ signUpModal: null })
  }
}
export const users: ModuleImpl<api.State, api.Actions> = _users
