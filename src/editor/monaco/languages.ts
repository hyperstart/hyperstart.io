import { SourceNode } from "projects/fileTree"
import { getExtension } from "utils"

const languages = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  md: "markdown"
}

export const getLanguage = (source: string | SourceNode): string =>
  languages[getExtension(typeof source === "string" ? source : source.name)]
