import { State } from "./api"

export function isLoading(state: State): boolean {
  return state.logger.current && state.logger.current.severity === "loading"
}
