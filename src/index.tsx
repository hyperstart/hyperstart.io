import { h, app as ha } from "hyperapp"

import { app } from "./app"
import { view } from "./view"

ha(app.state, app.actions, view, document.body).init()
