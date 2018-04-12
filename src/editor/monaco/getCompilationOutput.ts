import { Uri } from "monaco-editor"
import { LanguageService, EmitOutput, Diagnostic } from "lib/typescript"

import monaco from "./monaco"

export interface CompilationOutput {
  emit: EmitOutput
  compilerOptionsDiagnostics: Diagnostic[]
  semanticDiagnostics: Diagnostic[]
  syntacticDiagnostics: Diagnostic[]
}

const getOutput = (worker: any, path: string): Promise<CompilationOutput> => {
  let languageService: LanguageService
  let emit
  let semanticDiagnostics
  let syntacticDiagnostics
  let compilerOptionsDiagnostics
  const result: any = worker
    .then(service => {
      languageService = service
      return service.getEmitOutput(path)
    })
    .then(result => {
      emit = result
      return languageService.getSemanticDiagnostics(path)
    })
    .then(result => {
      semanticDiagnostics = result
      return languageService.getSyntacticDiagnostics(path)
    })
    .then(result => {
      syntacticDiagnostics = result
      return languageService.getCompilerOptionsDiagnostics()
    })
    .then(result => {
      compilerOptionsDiagnostics = result
      return {
        emit,
        semanticDiagnostics,
        syntacticDiagnostics,
        compilerOptionsDiagnostics
      }
    })
  return result
}

export const getCompilationOutput = (
  path: string,
  language: string
): Promise<CompilationOutput> => {
  const uri = Uri.from({ path })
  if (language === "javascript") {
    return getOutput(
      monaco.languages.typescript
        .getJavaScriptWorker()
        .then(worker => worker(uri)),
      uri.toString()
    )
  }
  if (language === "typescript") {
    return getOutput(
      monaco.languages.typescript
        .getTypeScriptWorker()
        .then(worker => worker(uri)),
      uri.toString()
    )
  }
  throw new Error(
    "Invalid language for path " +
      path +
      " must be javascript or typescript but got " +
      language
  )
}
