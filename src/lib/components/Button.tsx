import { h } from "hyperapp"

export interface ButtonProps {
  /**
   * undefined for regular size
   */
  size?: "sm" | "lg"
  block?: boolean
  primary?: boolean
  link?: boolean
  action?: boolean | "circle"
  active?: boolean
  disabled?: boolean
  loading?: boolean
  class?: string
  text?: string
  icon?: string
  iconRight?: boolean
  href?: string
  onclick?(e: Event): void
}

export const getElementsForTextAndIcon = (
  text?: string,
  icon?: string,
  iconRight?: boolean
): any[] => {
  if (text) {
    if (icon) {
      if (iconRight) {
        return [text, <i class={`fa fa-${icon}`} aria-hidden="true" />]
      }
      return [<i class={`fa fa-${icon}`} aria-hidden="true" />, text]
    }
    return [text]
  }
  if (icon) {
    return [<i class={`fa fa-${icon}`} aria-hidden="true" />]
  }
  return []
}

export const Button = (props: ButtonProps, children?: any) => {
  const {
    size,
    block,
    primary,
    link,
    action,
    active,
    disabled,
    loading,
    text,
    icon,
    iconRight,
    href,
    onclick = e => {
      e.preventDefault()
    }
  } = props
  const Tag = href ? "a" : "button"

  // console.log(
  //   'Icon: ' + icon + '  text: ' + text + '  result: ',
  //   getElementsForTextAndIcon(text, icon, iconRight),
  //   children
  // )

  return (
    <Tag
      class={
        "btn" +
          (size ? "btn-" + size : "") +
          (block ? " btn-block" : "") +
          (primary ? " btn-primary" : link ? " btn-link" : "") +
          (action === "circle"
            ? " btn-action circle"
            : action ? " btn-action" : "") +
          (active ? " active" : "") +
          (disabled ? " disabled" : "") +
          (loading ? " loading" : "") +
          " " +
          props.class || ""
      }
      onclick={onclick}
      href={href}
    >
      {!children || (Array.isArray(children) && children.length === 0)
        ? getElementsForTextAndIcon(text, icon, iconRight)
        : children}
    </Tag>
  )
}
