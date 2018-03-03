import { h } from "hyperapp"

import { UrlIcon } from "lib/components"

import { Details } from "../api"

// # Artifact Owner

export interface ArtifactOwnerProps {
  project: Details
  Tag?: string
  class: string
}

export function ArtifactOwner(props: ArtifactOwnerProps) {
  const { project, Tag = "span" } = props
  const name =
    project.owner && project.owner.displayName
      ? project.owner.displayName
      : "Anonymous User"
  const url = project.owner && project.owner.url ? project.owner.url : ""

  return (
    <Tag class={props.class}>
      {name + " "}
      <UrlIcon url={url} />
    </Tag>
  )
}
