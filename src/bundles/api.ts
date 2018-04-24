import { ModuleActions } from "api"
import { Bundle } from "lib/bundler"

// # State

export interface State {
  [id: string]: Bundle
}

// # Actions

export interface GetBundlePayload {
  name: string
  version: string
}

export interface Actions extends ModuleActions<State> {
  getFromNpmPackage(payload: GetBundlePayload): Promise<Bundle>
}
