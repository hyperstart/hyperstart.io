import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export interface InitialFields {
  [name: string]: boolean | string | api.FormFieldOption[]
}

export function createFormState(fields: InitialFields = {}): api.State {
  const state: api.State = {}
  Object.keys(fields).forEach(name => {
    const value = fields[name]
    if (typeof value === "string" || typeof value === "boolean") {
      state[name] = {
        original: value,
        value
      }
    } else {
      const val = value.length === 0 ? null : value[0].value

      state[name] = {
        original: val,
        value: val,
        options: value
      }
    }
  })
  return state
}

const GLOBAL_FIELD = "__GLOBAL"

export function createForm(
  fields: InitialFields = {}
): ModuleImpl<api.State, api.Actions> {
  return {
    state: createFormState(fields),
    actions: {
      set: ({ error, fields = {} }: api.FormUpdate) => state => {
        const updates: api.State = {}

        Object.keys(fields).forEach(key => {
          updates[key] = { ...state[key], ...fields[key] }
        })

        if (typeof error !== undefined) {
          updates[GLOBAL_FIELD] = { ...state[GLOBAL_FIELD], error }
        }

        return updates
      },
      setField: (payload: api.FormFieldUpdate) => state => {
        const { field, ...values } = payload
        return { [field]: { ...state[field], ...values } }
      }
    }
  }
}
