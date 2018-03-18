import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export function createForm(
  state: api.State = {}
): ModuleImpl<api.State, api.Actions> {
  return {
    state,
    actions: {
      set: (form: api.FormUpdate) => state => {
        return { ...state, ...form }
      },
      setField: (payload: api.FormFieldUpdate) => state => {
        const { field, ...values } = payload
        return { [field]: { ...state[field], ...values } }
      }
    }
  }
}
