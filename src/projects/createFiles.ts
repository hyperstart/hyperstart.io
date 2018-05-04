import { guid, StringMap } from "lib/utils"

import { Files } from "./api"
import { DEPENDENCIES_FOLDER_NAME } from "./constants"

// # Blank sources

const blankJs = `import "./index.css"

document.getElementById("app").innerHTML = "Hello World"
`

const blankHtml = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>New Project</title>
</head>

<body>
  <div id="app">Loading...</div>

  <!-- Generated Bundle, Do not change the line below -->
  <script src="/bundle.js"></script>
</body>

</html>
`

const blankCss = ``

const blankPkg = `{
  "name": "new-project",
  "version": "0.0.1",
  "main": "index.js"
}`

// # HA sources

const haJs = `import { h, app } from "hyperapp"

import "./index.css"

const state = {
  count: 0
}

const actions = {
  down: () => state => ({ count: state.count - 1 }),
  up: () => state => ({ count: state.count + 1 })
}

const view = (state, actions) => (
  <main>
    <h1>{state.count}</h1>
    <button onclick={actions.down}>-</button>
    <button onclick={actions.up}>+</button>
  </main>
)

app(state, actions, view, document.body)
`

const haHtml = blankHtml

const haCss = blankCss

export function createBlankFiles(): Files {
  return {
    "/index.css": { edits: 0, content: blankCss },
    "/index.html": { edits: 0, content: blankHtml },
    "/index.js": { edits: 0, content: blankJs }
  }
}

export function createHyperappFiles(): Files {
  return {
    "/index.css": { edits: 0, content: haCss },
    "/index.html": { edits: 0, content: haHtml },
    "/index.js": { edits: 0, content: haJs }
  }
}
