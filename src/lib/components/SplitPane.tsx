import { h } from "hyperapp"

// # Component

export interface SplitPaneProps {
  horizontal?: boolean
  [name: string]: any
  pane0Percent?: number
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

  children[0].props.style = children[0].props.style
    ? { ...children[0].props.style, ...style0 }
    : style0
  children[1].props.style = children[1].props.style
    ? { ...children[1].props.style, ...style1 }
    : style1

  return (
    <section class={`split-pane ${vertical ? "vertical" : ""}`} {...rest}>
      {children[0]}
      <span class="resizer" />
      {children[1]}
    </section>
  )
}
