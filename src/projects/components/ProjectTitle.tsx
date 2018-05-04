import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { ProjectDetails } from "../api"

// # Project Title

export interface ProjectTitleProps {
  project: ProjectDetails
  Tag?: string
  class?: string
}

export const ProjectTitle = (props: ProjectTitleProps) => {
  const { project, Tag = "span" } = props

  return <Tag class={props.class || ""}>{project.name}</Tag>
}
