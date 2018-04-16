import { h } from "hyperapp"

export interface TabProps {
  block?: boolean
  style?: any
  class?: string
}

export const Tab = (props: TabProps, children) => {
  const { block = false } = props
  const className = props.class || ""
  delete props.block
  delete props.class
  return (
    <ul class={`tab ${block ? "tab-block" : ""} ${className}`} {...props}>
      {children}
    </ul>
  )
}
