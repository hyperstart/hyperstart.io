import { guid, StringMap } from "lib/utils"

import { File } from "./api"
import { files } from "./utils"
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
  "description": "New Project",
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

const haPkg = `{
  "name": "new-project",
  "version": "0.0.1",
  "description": "New Project",
  "main": "index.js",
  dependencies: {
    "hyperapp": "1.2.5"
  }
}`

// # Create file functions

export function createBlankFiles(): StringMap<File> {
  return files()
    .folder(DEPENDENCIES_FOLDER_NAME)
    .source("index.js", blankJs)
    .source("index.html", blankHtml)
    .source("index.css", blankCss)
    .source("package.json", blankPkg)
    .get()
}

export function createHyperappFiles(): StringMap<File> {
  return files()
    .folder(DEPENDENCIES_FOLDER_NAME)
    .source("index.js", haJs)
    .source("index.html", haHtml)
    .source("index.css", haCss)
    .source("package.json", haPkg)
    .get()
}

// # Old stuff

const jsImport = `import { text } from "./text"

document.getElementById("app").innerHTML = text
`

const jsText = `export const text = "Hello World"
`
