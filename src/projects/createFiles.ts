import { guid, StringMap } from "lib/utils"

import { File } from "./api"
import { files } from "./utils"
import { DEPENDENCIES_FOLDER_NAME } from "./constants"

const css = ``

const js = `import "./index.css"

document.getElementById("app").innerHTML = "Hello World"
`

const jsImport = `import { text } from "./text"

document.getElementById("app").innerHTML = text
`

const jsText = `export const text = "Hello World"
`

const html = `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Awesome Stuff</title>
</head>

<body>
  <div id="app">Loading...</div>

  <!-- Generated Bundle, Do not change the line below -->
  <script src="/bundle.js"></script>
</body>

</html>
`

const js2 = `import { h, app } from "hyperapp"

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

export function createBlankFiles(): StringMap<File> {
  return files()
    .folder(DEPENDENCIES_FOLDER_NAME)
    .source("index.js", js)
    .source("index.html", html)
    .source("index.css", css)
    .get()
}

export function createHyperappFiles(): StringMap<File> {
  return files()
    .source("index.js", js2)
    .source("index.html", html)
    .source("index.css", css)
    .get()
}
