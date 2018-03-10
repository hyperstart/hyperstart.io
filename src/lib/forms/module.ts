import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export function createForms(): ModuleImpl<api.State, api.Actions> {
  return {
    state: {},
    actions: {
      setForm: (payload: api.FormUpdate) => state => {
        const { form, ...values } = payload
        return {
          [form]: {
            ...state[form],
            ...values
          }
        }
      },
      setField: (payload: api.FormFieldUpdate) => state => {
        const { form, field, ...values } = payload
        const prev = state[form] || { loading: false, fields: {} }
        const prevField = prev.fields[field]
        return {
          [form]: {
            loading: prev.loading,
            fields: {
              ...prev.fields,
              [field]: {
                ...prevField,
                ...values
              }
            }
          }
        }
      }
    }
  }
}
