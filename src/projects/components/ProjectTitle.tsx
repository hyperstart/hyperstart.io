import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { Details } from "../api"

// # Project Title

export interface ProjectTitleProps {
  project: Details
  Tag?: string
  className?: string
}

export const ProjectTitle = (props: ProjectTitleProps) => {
  const { project, className = "", Tag = "span" } = props

  return (
    <Tag class={className}>
      {project.name + " "}
      <UrlIcon url={project.url} />
      {project.version ? <small> v{project.version}</small> : ""}
    </Tag>
  )
}
