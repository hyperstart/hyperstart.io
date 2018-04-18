import { h } from "hyperapp"

import { State, Actions, Diagnostic } from "../api"

interface FileWithErrors {
  path: string
  diagnostics: Diagnostic[]
}

function FileError({ path, diagnostics }: FileWithErrors) {
  return (
    <div>
      <h5>{path}</h5>
      {diagnostics.map(diagnostic => {
        return <p>{diagnostic.message}</p>
      })}
    </div>
  )
}

export interface CompilationErrorsProps {
  state: State
}

export function CompilationErrors(props: CompilationErrorsProps) {
  const { state } = props
  if (
    !state.compilationOutput ||
    state.compilationOutput.loading ||
    state.compilationOutput.success
  ) {
    throw new Error(
      "Unexpected editor state: " + JSON.stringify(state.compilationOutput)
    )
  }

  const error = state.compilationOutput.error
  const files: FileWithErrors[] = []
  if (state.compilationOutput.compiledModules) {
    Object.keys(state.compilationOutput.compiledModules).forEach(path => {
      const compiledModule = state.compilationOutput.compiledModules[path]

      if (compiledModule.diagnostics.length > 0) {
        files.push({ path, diagnostics: compiledModule.diagnostics })
      }
    })
    files.sort((f1, f2) => f1.path.localeCompare(f2.path))
  }

  return (
    <div>
      <h4>Compilation error(s)</h4>
      {error ? "Compilation error: " + error : ""}
      {files.map(FileError)}
    </div>
  )
}
