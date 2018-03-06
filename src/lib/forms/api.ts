import { FormFields } from "lib/form/api"

// # State

export interface Form {
  fields: FormFields
  loading: boolean
}

export interface State {
  [name: string]: Form
}

// # Actions

export interface FormUpdate {
  form: string
  fields?: FormFields
  loading?: boolean
}

export interface FormFieldUpdate {
  form: string
  field: string
  value?: any
  error?: string
  info?: string
}

export interface Actions {
  setForm(form: FormUpdate)
  setField(field: FormFieldUpdate)
}
