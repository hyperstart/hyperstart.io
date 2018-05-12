import { h } from "hyperapp"
import { Icon } from "./Icon"

export interface DropdownProps {
  text: string
  right?: boolean
  class?: string
  primary?: boolean
}

export function Dropdown(props: DropdownProps, children) {
  const { text, right, primary } = props

  return (
    <div
      class={`dropdown${right ? " dropdown-right" : ""} ${props.class || ""}`}
    >
      <a
        class={`btn dropdown-toggle btn-${primary ? "primary" : "secondary"}`}
        tabindex="0"
      >
        {text} <Icon name="caret-down" />
      </a>
      <ul class="menu">{children}</ul>
    </div>
  )
}
