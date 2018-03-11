import { h, app } from "hyperapp"
import devtools from "hyperapp-redux-devtools"

import { module } from "./module"
import { view } from "./view"

devtools(app)(
  module.state,
  module.actions,
  view,
  document.getElementById("app")
).init()
