import { ModuleActions } from "api"

import * as form from "lib/form"

// # State

export interface User {
  id: string
  displayName: string
  email: string
  emailVerified: boolean
}

export interface State {
  loading: boolean
  selectedEmail?: string
  user?: User
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
  resetIdentity()
  signUp(source: "form" | "modal"): Promise<void>
  signIn(): Promise<void>
  signInWithGoogle(): Promise<void>
  signInWithGithub(): Promise<void>
  signOut(): Promise<void>
  // ## UI
  signUpForm: form.Actions
  signInModal: form.Actions
  showSignInModal()
  hideSignInModal()
  signUpModal: form.Actions
  showSignUpModal()
  hideSignUpModal()
}
