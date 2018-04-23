import { h, app } from "hyperapp"
import devtools from "hyperapp-devtools"

import { module } from "./module"
import { State, Actions } from "./api"
import { view } from "./view"

devtools<any>(app)(module.state, module.actions, view, document.body).init()

// import { bundle } from "lib/bundler"
// console.log("Starting... " + new Date())
// bundle("webpack").then(bundle => {
//   // react rollup webpack
//   // @hyperapp/router
//   console.log("Done: " + new Date())
//   // console.log(JSON.stringify(bundle, null, 2))
// })
