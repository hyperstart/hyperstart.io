import { ModuleActions } from "api"

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
  authenticated: boolean
  loading: boolean
  user?: User
  error?: Error
}

// # Actions

export interface Listener {
  (user?: User): void
}

export interface SignUpPayload {
  email: string
  password: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface Actions extends ModuleActions<State> {
  initAuthentication(listeners: Listener[])
  resetIdentity()
  signUp(payload: SignUpPayload): Promise<void>
  signIn(payload: SignInPayload): Promise<void>
  signOut(): Promise<void>
}
