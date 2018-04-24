import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { Details } from "../api"

// # Project Owner

export interface ProjectOwnerProps {
  project: Details
  Tag?: string
  class?: string
}

export function ProjectOwner(props: ProjectOwnerProps) {
  const { project, Tag = "span" } = props
  const name =
    project.owner && project.owner.displayName
      ? project.owner.displayName
      : "Anonymous User"

  return <Tag class={props.class}>{name}</Tag>
}
