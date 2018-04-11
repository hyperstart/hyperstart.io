import { h } from "hyperapp"

export interface BlogPageProps {
  // nothing for now
}

export function BlogPage(props: BlogPageProps) {
  //const text = "world"
  return (
    <iframe
      style={{ "flex-grow": "1" }}
      src="https://hyperstart.github.io/blog/"
    />
  )
}
