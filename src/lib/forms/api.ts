import { FormField } from "lib/form/api"

// # State

export interface Form {
  [field: string]: FormField
}

export interface State {
  [name: string]: Form
}

// # Actions

export interface FormUpdate {
  form: string
  fields: Form
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
