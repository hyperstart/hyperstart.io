import { ModuleActions } from "api"

import * as form from "lib/form"

// # State

export interface User {
  id: string
  displayName?: string
  email?: string
  emailVerified?: boolean
  anonymous: boolean
  linkedTo?: User
}

export interface State {
  loading: boolean
  user?: User
  selectedEmail?: string
  signUpForm: form.State
  signInModal?: form.State
  signUpModal?: form.State
}

// # Actions

export interface AuthListener {
  (user: User | null, previous: User | null): void
}

export interface Actions extends ModuleActions<State> {
  // ## Authentication
  initAuthentication(listeners: AuthListener[])
  signUp(source: "form" | "modal"): Promise<void>
  signIn(): Promise<void>
  signInWithGoogle(): Promise<void>
  signInWithGithub(): Promise<void>
  signOut(): Promise<void>
  /** Get the current user, authenticate anonymously if needed. */
  ensureUser(): Promise<User>
  // ## UI
  signUpForm: form.Actions
  signInModal: form.Actions
  showSignInModal()
  hideSignInModal()
  signUpModal: form.Actions
  showSignUpModal()
  hideSignUpModal()
}

export interface FirebaseAuthError {
  code: string
  message: string
}

export interface UserChangeEvent {
  user: User | null
  previous: User | null
}

export interface InternalActions extends Actions {
  _set(payload: Partial<State>)
  _errorOnSignIn(error: FirebaseAuthError)
  _errorOnSignUp(error: FirebaseAuthError)
}
