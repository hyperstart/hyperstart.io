import { h } from "hyperapp"

export interface ModalProps {
  active: boolean
  close(): void
  size?: "sm" | "lg"
  title?: string
  titleTag?: string
  Footer?: any
  class?: string
}

export function Modal(props: ModalProps, children) {
  const { active, close, title = "Modal", size } = props
  const Title = props.titleTag
  const Footer = props.Footer ? (
    <div class="modal-footer">
      <props.Footer />
    </div>
  ) : null
  const className = `modal ${active ? "active" : ""} ${
    size ? "modal-" + size : ""
  } ${props.class || ""}`
  return (
    <div class={className}>
      <a href="#" class="modal-overlay" aria-label="Close" onclick={close} />
      <div class="modal-container">
        <div class="modal-header">
          <a
            href="#"
            class="btn btn-clear float-right"
            aria-label="Close"
            onclick={close}
          />
          <Title class="modal-title">{title}</Title>
        </div>
        <div class="modal-body">
          <div class="content">{children}</div>
        </div>
        {Footer}
      </div>
    </div>
  )
}
