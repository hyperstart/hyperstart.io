import { h } from "hyperapp"

export interface TabProps {
  block?: boolean
  style?: any
}

export const Tab = ({ block = false, ...rest }: TabProps, children) => (
  <ul class={`tab${block ? " tab-block" : ""}`} {...rest}>
    {children}
  </ul>
)
