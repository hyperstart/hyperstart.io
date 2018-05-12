import { h } from "hyperapp"
import { Icon } from "./Icon"

import "./DropdownItem.scss"

export interface DropdownItemProps {
  text?: string
  divider?: boolean
  onclick?(e: Event)
  disabled?: boolean
  class?: string
}

export function DropdownItem(props: DropdownItemProps, children) {
  const { text = "", divider, onclick = () => {}, disabled = false } = props

  if (divider) {
    return <li class={`divider ${props.class || ""}`} data-content={text} />
  }

  return (
    <li class={`menu-item ${props.class || ""}`}>
      <a href="#" class={disabled ? "disabled" : ""} onclick={onclick}>
        {text}
      </a>
    </li>
  )
}
