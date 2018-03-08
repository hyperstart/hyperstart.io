import { h } from "hyperapp"

export interface TabItemProps {
  active?: boolean
}

export const TabItem = (
  { active = false, ...rest }: TabItemProps,
  children
) => (
  <li class={`tab-item${active ? " active" : ""}`} {...rest}>
    {children}
  </li>
)
