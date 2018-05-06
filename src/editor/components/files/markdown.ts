import marked from "marked"

import { getEditorUrl } from "utils"
import { toAbsolute } from "lib/router"
import { ProjectDetails } from "projects"
import { Actions } from "../../api"

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function unescape(html) {
  // explicitly match decimal, hex, and named HTML entities
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi, function(
    _,
    n
  ) {
    n = n.toLowerCase()
    if (n === "colon") return ":"
    if (n.charAt(0) === "#") {
      return n.charAt(1) === "x"
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1))
    }
    return ""
  })
}

const renderer = (): any => {
  const result = new marked.Renderer()

  result.code = function(code, lang, escaped) {
    if (this.options.highlight) {
      var out = this.options.highlight(code, lang)
      if (out != null && out !== code) {
        escaped = true
        code = out
      }
    }

    if (!lang) {
      return (
        '<pre class="code"><code>' +
        (escaped ? code : escape(code, true)) +
        "\n</code></pre>"
      )
    }

    return (
      '<pre class="code"><code>' +
      (escaped ? code : escape(code, true)) +
      "\n</code></pre>\n"
    )
  }

  result.table = function(header, body) {
    return (
      '<table class="table table-striped table-hover">\n' +
      "<thead>\n" +
      header +
      "</thead>\n" +
      "<tbody>\n" +
      body +
      "</tbody>\n" +
      "</table>\n"
    )
  }

  const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i

  result.link = function(href: string, title: string, text: string) {
    if (originIndependentUrl.test(href)) {
      return `<a href=${href} ${
        title ? "title=" + title : ""
      } target="_blank">${text}</a>`
    }

    const to = toAbsolute(window.location.pathname, href)
    return `<a href=${to} ${
      title ? "title=" + title : ""
    } class="markdown-local-link">${text}</a>`
  }

  return result
}

export const render = (markdown: string): string => {
  return marked(markdown, { sanitize: false, renderer: renderer() })
}

export const postRender = (e: HTMLElement, actions: Actions) => {
  // set onclick handler for local links
  const links = e.getElementsByClassName("markdown-local-link")
  for (let i = 0; i < links.length; i++) {
    const link = links.item(i) as HTMLAnchorElement
    link.onclick = function(e) {
      e.preventDefault()
      actions.previewFile(link.href)
    }
  }
}
