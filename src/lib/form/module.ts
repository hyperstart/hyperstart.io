import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export function createForm(): ModuleImpl<api.State, api.Actions> {
  return {
    state: {
      fields: {},
      loading: false
    },
    actions: {
      set: (form: api.FormUpdate) => state => {
        return {
          ...state,
          ...form
        }
      },
      setField: (payload: api.FormFieldUpdate) => state => {
        const { field, ...values } = payload
        const fields = {
          ...state.fields,
          [field]: {
            ...state.fields[field],
            ...values
          }
        }
        return {
          fields
        }
      }
    }
  }
}
