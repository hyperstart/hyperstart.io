import { ModuleImpl } from "lib/modules"

import { createProjects } from "projects/module"

import { debug } from "./debug/module"
import { sources } from "./sources/module"
import { ui } from "./ui/module"
import * as api from "./api"

// TODO
const localStore = createProjects(null)

export const editor: ModuleImpl<api.State, api.Actions> = {
  state: {
    debug: debug.state,
    files: { byId: {}, byPath: {}, roots: [] },
    localStore: localStore.state,
    status: "closed",
    sources: sources.state,
    ui: ui.state
  },
  actions: null
}
