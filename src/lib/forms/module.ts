import { ModuleImpl } from "lib/modules"

import * as api from "./api"

export function createForms(): ModuleImpl<api.State, api.Actions> {
  return {
    state: {},
    actions: {
      setForm: (payload: api.FormUpdate) => state => {
        const { form, fields } = payload
        return {
          [form]: { ...state[form], ...fields }
        }
      },
      setField: (payload: api.FormFieldUpdate) => state => {
        const { form, field, ...values } = payload
        const prev = state[form] || {}
        const prevField = prev[field]
        return {
          [form]: {
            ...prev,
            [field]: { ...prevField, ...values }
          }
        }
      }
    }
  }
}
