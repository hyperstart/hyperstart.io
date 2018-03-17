import { ModuleActions } from "api"

import * as form from "lib/form"

// # State

export interface Error {
  code: number
  message: string
}

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
  error?: Error
  signInModal?: form.State
  signUpModal?: form.State
}

// # Actions

export interface Listener {
  (user?: User): void
}

export interface SignUpPayload {
  email: string
  password: string
  passwordConfirm: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface Actions extends ModuleActions<State> {
  // ## Authentication
  initAuthentication(listeners: Listener[])
  resetIdentity()
  signUp(payload: SignUpPayload): Promise<void>
  signIn(payload: SignInPayload): Promise<void>
  signOut(): Promise<void>
  // ## UI
  signInModal: form.Actions
  showSignInModal()
  hideSignInModal()
  signUpModal: form.Actions
  showSignUpModal()
  hideSignUpModal()
}
