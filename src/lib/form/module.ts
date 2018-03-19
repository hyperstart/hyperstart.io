import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export interface InitialFields {
  [name: string]: any
}

export function createFormState(fields: InitialFields = {}): api.State {
  const state: api.State = {}
  Object.keys(fields).forEach(name => {
    const value = fields[name]
    state[name] = {
      original: value,
      value
    }
  })
  return state
}

export function createForm(
  fields: InitialFields = {}
): ModuleImpl<api.State, api.Actions> {
  return {
    state: createFormState(fields),
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
