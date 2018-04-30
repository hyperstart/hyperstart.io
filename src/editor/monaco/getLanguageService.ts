import { getLanguage } from "./languages"

export function getLanguageService(path: string): monaco.Promise<any> {
  const language = getLanguage(path)
  const uri = monaco.Uri.from({ path })
  if (language === "javascript") {
    return monaco.languages.typescript
      .getJavaScriptWorker()
      .then(worker => worker(uri))
  }
  if (language === "typescript") {
    return monaco.languages.typescript
      .getTypeScriptWorker()
      .then(worker => worker(uri))
  }
  return new monaco.Promise((done, error) =>
    error("Source file is neither typescript nor javascript: " + path)
  )
}
