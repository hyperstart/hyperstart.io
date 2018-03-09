import { StringMap } from "lib/utils"
import { Diagnostic } from "editor"

export interface CompileOutput {
  success: boolean
  code?: string
  modules?: StringMap<Diagnostic[]>
  errorMessage?: string
}
