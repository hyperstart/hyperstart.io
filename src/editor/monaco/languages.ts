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

export const getLanguage = (source: string): string =>
  languages[getExtension(source)]
