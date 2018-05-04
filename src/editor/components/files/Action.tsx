import { h } from "hyperapp"

export interface ActionProps {
  onclick(): void
  icon: string
  tooltip?: string
  "tooltip-side"?: "left" | "right" | "bottom"
}

export function Action(props: ActionProps) {
  const { onclick, icon, tooltip } = props
  const side = props["tooltip-side"] || "left"
  return (
    <button
      class={`btn btn-link ${tooltip && `tooltip tooltip-${side}`}`}
      data-tooltip={tooltip}
      onclick={(e: Event) => {
        e.stopImmediatePropagation()
        props.onclick()
      }}
    >
      <span class={props.icon + " fa-fw"} aria-hidden={true} />
    </button>
  )
}
