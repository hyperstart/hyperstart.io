// # State

export interface FormFieldOption {
  value: string
  label: string
}

export interface FormFieldState {
  original: any
  value: any
  options?: FormFieldOption[]
  loading?: boolean
  error?: string
  info?: string
}

export interface State {
  [name: string]: FormFieldState
}

// # Actions

export interface FormFieldStateUpdate {
  value?: string | boolean
  error?: string
  info?: string
  loading?: boolean
  options?: FormFieldOption[]
}

export interface FieldsUpdate {
  [name: string]: FormFieldStateUpdate
}

export interface FormUpdate {
  fields?: FieldsUpdate
  error?: string
}

export interface FormFieldUpdate {
  field: string
  value?: string | boolean
  error?: string
  info?: string
  loading?: boolean
  options?: FormFieldOption[]
}

export interface Actions {
  set(form: FormUpdate)
  setField(field: FormFieldUpdate)
}
