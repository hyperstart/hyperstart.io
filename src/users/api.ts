import { ModuleActions } from "api"

import * as form from "lib/form"

// # State

export interface User {
  id: string
  displayName?: string
  email?: string
  emailVerified?: boolean
  anonymous: boolean
}

export interface State {
  loading: boolean
  selectedEmail?: string
  signUpForm: form.State
  signInModal?: form.State
  signUpModal?: form.State
}

// # Actions

export interface AuthListener {
  (user?: User): void
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
  getCurrentUser(): Promise<User>
  /** Get the current user, DOES NOT authenticate anonymously. */
  getCurrentUserSync(): User | null
  // ## UI
  signUpForm: form.Actions
  signInModal: form.Actions
  showSignInModal()
  hideSignInModal()
  signUpModal: form.Actions
  showSignUpModal()
  hideSignUpModal()
}
