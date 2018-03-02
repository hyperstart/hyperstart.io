import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export const logger: ModuleImpl<api.State, api.Actions> = {
  state: null,
  actions: null
}
