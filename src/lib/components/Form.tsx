import { h } from "hyperapp"

// Adapted from https://github.com/lukejacksonn/hyperapp-firebase-auth/blob/master/src/form.js

// # Field

export interface FieldProps {
  name: string
  label?: string
  id?: string
  errorText?: string
  value?: string
  [key: string]: any
}

function Field(props: FieldProps) {
  const { label, id, errorText, ...rest } = props
  return (
    <div
      class={`form-group ${errorText ? "has-error" : ""}`}
      style={{ display: rest.type === "hidden" && "none" }}
    >
      {label && (
        <label class="form-label" for={id}>
          {label}
        </label>
      )}
      <input {...rest} class={`form-input ${props.class || ""}`} />
      {errorText && <p class="form-input-hint">{errorText}</p>}
    </div>
  )
}

// # Link

export interface LinkProps {
  text: string
  action?: () => void
  href?: string
}

function Link(props: LinkProps) {
  const { text, action, href } = props

  const onclick = (e: Event) => {
    if (action) {
      e.preventDefault()
      action()
    }
  }
  return (
    <a href={href || "#"} onclick={onclick}>
      {text}
    </a>
  )
}

// # Form

export interface Values {
  [inputName: string]: string
}

export interface FormProps {
  title?: string
  subtitle?: string
  submitText?: string
  onSubmit?: (values: Values) => void
  fields: FieldProps[]
  links: LinkProps[]
}

function collectValues(form: HTMLFormElement) {
  return Array.from(form.elements)
    .filter((e: HTMLInputElement) => e.type != "submit")
    .reduce(
      (a, { name, value }: HTMLInputElement) =>
        Object.assign(a, { [name]: value }),
      {}
    )
}

export function Form(props: FormProps) {
  const {
    title = "Untitled Form",
    subtitle = "Please fill out and submit the form below",
    submitText = "Submit",
    onSubmit = values => console.log("Form submitted.", values),
    fields = [],
    links = []
  } = props
  return (
    <form
      oncreate={e => e.elements[0].focus()}
      onsubmit={e => {
        e.preventDefault()
        onSubmit(collectValues(e))
      }}
    >
      <header>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </header>
      {fields.map(field => Field(field))}
      <button type="submit">{submitText}</button>
      <footer>{links.map(link => Link(link))}</footer>
    </form>
  )
}
