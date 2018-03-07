import { State } from "./api"

export function isEditable(state: State): boolean {
  return state.status === "editing"
}
