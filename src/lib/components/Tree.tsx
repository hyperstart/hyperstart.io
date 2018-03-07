import { h } from "hyperapp"

export interface NodeViewProps<T> {
  item: T
  /** Rest of the props, passed from the tree */
  [name: string]: any
}

export interface BaseProps<T> {
  getChildren(item: T): T[] | null
  toggleExpanded(item: T)
  View(props: NodeViewProps<T>): any
  nodesClass?: string
  nodeClass?: string
  itemProps?: any
}

// # Node

interface NodeProps<T> extends BaseProps<T> {
  item: T
}

function Node<T>(props: NodeProps<T>) {
  const { item, ...rest } = props
  const itemProps = props.itemProps || {}
  const items = props.getChildren(item)
  const expanded = items && items.length
  const children = expanded ? (
    <NodeList items={items} itemProps={itemProps} {...rest} />
  ) : null
  return (
    <div class={props.nodeClass || ""}>
      <div
        onclick={e => {
          props.toggleExpanded(item)
        }}
      >
        <props.View item={item} {...itemProps} />
      </div>
      {children}
    </div>
  )
}

// # NodeList

interface NodeListProps<T> extends BaseProps<T> {
  items: T[]
}

function NodeList<T>(props: NodeListProps<T>) {
  const { items, ...rest } = props
  const children = items.map(item => <Node item={item} {...rest} />)
  return <div class={props.nodesClass || ""}>{children}</div>
}

// # Tree

export interface TreeProps<T> extends BaseProps<T> {
  items: T[]
  class?: string
}

export function Tree<T>(props: TreeProps<T>) {
  return <div class={props.class}>{NodeList(props)}</div>
}
