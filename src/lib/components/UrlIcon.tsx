import { h } from "hyperapp"

const isGithubUrl = (url: string): boolean =>
  url && url.startsWith("https://github.com")

// # Url Icon

export interface UrlIconProps {
  url?: string
  text?: string
  [key: string]: any
}

export function UrlIcon(props: UrlIconProps) {
  const { url = "", text = "" } = props

  if (url === "") {
    return null
  }

  const icon = isGithubUrl(url) ? "fa-github" : "fa-globe"
  return (
    <a
      href={url}
      target="_blank"
      class={props.class || "url-icon"}
      style={{ color: "black" }}
    >
      {text}
      <i class={"fa " + icon} aria-hidden="true" />
    </a>
  )
}
