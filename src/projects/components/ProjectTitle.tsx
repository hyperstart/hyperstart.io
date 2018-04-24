import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { Details } from "../api"

// # Project Title

export interface ProjectTitleProps {
  project: Details
  Tag?: string
  class?: string
}

export const ProjectTitle = (props: ProjectTitleProps) => {
  const { project, Tag = "span" } = props

  return <Tag class={props.class || ""}>{project.name}</Tag>
}
