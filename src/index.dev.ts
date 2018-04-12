import { h, app } from "hyperapp"
import devtools from "hyperapp-devtools"

// import { module } from "./module"
// import { State, Actions } from "./api"
// import { view } from "./view"

// devtools<any>(app)(module.state, module.actions, view, document.body).init()

import { create, view } from "./test-app"
const module = create()
devtools<any>(app)(module.state, module.actions, view, document.body).init()
