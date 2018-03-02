import { h, app } from "hyperapp"

import { module } from "./module"
import { view } from "./view"

app(module.state, module.actions, view, document.body).init()
