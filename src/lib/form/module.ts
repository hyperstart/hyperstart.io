import { ModuleImpl } from "lib/modules"

import * as api from "./api"

// TODO

export function createForm(): ModuleImpl<api.State, api.Actions> {
  return {
    state: null,
    actions: null
  }
}
