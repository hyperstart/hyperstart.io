import { h } from "hyperapp"

export interface PageTemplateProps {
  // nothing for now
}

export function PageTemplate(props: PageTemplateProps) {
  const text = "world"
  return <div>Hello {text}</div>
}
