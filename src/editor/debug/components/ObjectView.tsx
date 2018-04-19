import { h } from "hyperapp"

import "./ObjectView.scss"

function Wrap(props, children) {
  var key = props.key

  return (
    <div class="-row">
      {key && <span class="-key">{key}</span>}
      {children}
    </div>
  )
}

function Pair(props, classList = "") {
  return Wrap(props, <span class={classList}>{props.value + ""}</span>)
}

function Switch(props, path, expanded) {
  var value = props.value
  switch (typeof value) {
    case "boolean":
      return Pair(props, "-boolean")
    case "function":
      return Wrap(props, <span class="-function" />)
    case "number":
      return Pair(props, "-number")
    case "object":
      return Wrap(
        props,
        value ? (
          Array.isArray(value) ? (
            Arr(value, path, expanded)
          ) : (
            Obj(value, path, expanded)
          )
        ) : (
          <span class="-null" />
        )
      )
    case "string":
      return Pair(props, "-string")
    case "undefined":
      return Wrap(props, <span class="-undefined" />)
  }
  return Pair(props)
}

function Expand(path, expanded) {
  return (
    expanded && <span class="-expand" onclick={() => expanded(path, true)} />
  )
}

function Collapse(path, expanded) {
  return (
    expanded && <span class="-collapse" onclick={() => expanded(path, false)} />
  )
}

function Arr(value, path, expanded) {
  if (expanded && !expanded(path)) {
    return <span class="-array">{Expand(path, expanded)}</span>
  }
  var result = [Collapse(path, expanded)]
  for (var i = 0; i < value.length; i++) {
    result.push(Switch({ value: value[i] }, path + "." + i, expanded))
  }
  return <span class="-array">{result}</span>
}

function Obj(value, path, expanded) {
  if (expanded && !expanded(path)) {
    return <span class="-object">{Expand(path, expanded)}</span>
  }
  var keys = Object.keys(value)
  var result = [Collapse(path, expanded)]
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    result.push(
      Switch({ key: key, value: value[key] }, path + "." + key, expanded)
    )
  }
  return <span class="-object">{result}</span>
}

export interface ObjectViewProps {
  /** The value to actually render, may be anything */
  value: any
  /** The function to expand a path, or get the status of a path */
  expanded?(path: string, expand?: boolean): boolean
  /** The path, defaults to "root" */
  path?: string
}

export function ObjectView(props: ObjectViewProps) {
  props.path = props.path || ""
  return (
    <div class="_object-view">{Switch(props, props.path, props.expanded)}</div>
  )
}
