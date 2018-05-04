import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { ProjectDetails } from "../api"

// # Project Owner

export interface ProjectOwnerProps {
  project: ProjectDetails
  Tag?: string
  class?: string
}

export function ProjectOwner(props: ProjectOwnerProps) {
  const { project, Tag = "span" } = props
  const owner = project.owner
  const name = owner && !owner.anonymous ? owner.displayName : "Anonymous User"

  return <Tag class={props.class}>{name}</Tag>
}
