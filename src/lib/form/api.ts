// # State

export interface FormFieldState {
  original: any
  value: any
  error?: string
  info?: string
}

export interface State {
  [name: string]: FormFieldState
}

// # Actions

export interface FormFieldStateUpdate {
  value?: any
  error?: string
  info?: string
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
  value?: any
  error?: string
  info?: string
}

export interface Actions {
  set(form: FormUpdate)
  setField(field: FormFieldUpdate)
}
