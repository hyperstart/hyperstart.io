// # State

export interface FormField {
  original: any
  value: any
  error?: string
  info?: string
}

export interface State {
  [name: string]: FormField
}

// # Actions

export interface FormUpdate {
  [name: string]: FormField
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
