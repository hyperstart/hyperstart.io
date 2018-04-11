import { h } from "hyperapp"

export interface BlogPageProps {
  // nothing for now
}

export function BlogPage(props: BlogPageProps) {
  //const text = "world"
  return (
    <iframe
      style={{ "flex-grow": "1", "border-style": "none" }}
      src="https://hyperstart.github.io/blog/"
    />
  )
}
