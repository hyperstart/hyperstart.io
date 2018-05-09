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

const blankCss = `body {
  background-color: #1e1e1e;
  color:#dddddd;
}`

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

const haCss = `body {
  align-items: center;
  background-color: #111;
  display: flex;
  font-family: Helvetica Neue, sans-serif;
  height: 100vh;
  justify-content: center;
  margin: 0;
  padding: 0;
  line-height: 1;
  text-align: center;
  color: #00caff;
}
h1 {
  color: inherit;
  font-weight: 100;
  font-size: 8em;
  margin: 0;
  padding-bottom: 15px;
}
button {
  background: #111;
  border-radius: 0px;
  border: 1px solid #00caff;
  color: inherit;
  font-size: 2em;
  font-weight: 100;
  line-height: inherit;
  margin: 0;
  outline: none;
  padding: 5px 15px 10px;
  transition: background .2s;
}
button:hover,
button:active,
button:disabled {
  background: #00caff;
  color: #111;
}
button:active {
  outline: 2px solid #00caff;
}
button:focus {
  border: 1px solid #00caff;
}
button + button {
  margin-left: 3px;
}`

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
