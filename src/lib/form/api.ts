// # State

export interface FormField {
  original: any
  value: any
  error?: string
  info?: string
}

export interface FormFields {
  [name: string]: FormField
}

export interface State {
  fields: FormFields
  loading: boolean
}

// # Actions

export interface FormUpdate {
  fields?: FormFields
  loading?: boolean
}

export interface FormFieldUpdate {
  field: string
  value?: any
  error?: string
  info?: string
}

export interface Actions {
  set(form: FormUpdate)
  setField(field: FormFieldUpdate)
}
