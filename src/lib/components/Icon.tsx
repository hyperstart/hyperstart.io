import { h } from "hyperapp"

export interface IconProps {
  name: string
  class?: string
}

export function Icon(props: IconProps) {
  return (
    <i class={`fa fa-${props.name} ${props.class || ""}`} aria-hidden="true" />
  )
}
