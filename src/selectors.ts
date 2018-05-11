import { State } from "./api"
import { getUrlParameter } from "lib/utils"

export function isLoading(state: State): boolean {
  return state.logger.current && state.logger.current.severity === "loading"
}

export function isInIframe(): boolean {
  return getUrlParameter("target") === "iframe"
}
