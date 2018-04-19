import { h } from "hyperapp"

import "./SplitPane.scss"

// # Component

export interface SplitPaneProps {
  horizontal?: boolean
  pane0Percent?: number
  class?: string
  [name: string]: any
}

export function SplitPane(props: SplitPaneProps, children: any[]) {
  const { horizontal = false, pane0Percent = 50, ...rest } = props || {}
  const vertical = !props.horizontal
  if (children.length !== 2) {
    throw new Error("Expected exactly 2 children, but got " + children.length)
  }

  const style0 = {
    outline: "solid 1px #ccc",
    "flex-grow": 0,
    "flex-basis": pane0Percent + "%"
  }

  const resizerStyle = {
    outline: "solid 1px #ccc",
    "flex-grow": 0,
    "flex-basis": "1px"
  }

  const pane1Percent = 100 - pane0Percent
  const style1 = {
    outline: "solid 1px #ccc",
    "flex-grow": 0,
    "flex-basis": pane1Percent + "%"
  }

  children[0].attributes.style = children[0].attributes.style
    ? { ...children[0].attributes.style, ...style0 }
    : style0
  children[1].attributes.style = children[1].attributes.style
    ? { ...children[1].attributes.style, ...style1 }
    : style1

  const className = rest.class || ""
  delete rest.class

  return (
    <section
      class={`split-pane ${vertical ? "vertical" : ""} ${className}`}
      {...rest}
    >
      {children[0]}
      <span class="resizer" />
      {children[1]}
    </section>
  )
}
