import { Details } from "projects"

export const getExtension = (id: string): string => {
  const segments = (id || "").split(".")
  if (segments.length === 0) {
    throw new Error('Cannot get extension from bundle ID: "' + id + '"')
  }
  return segments[segments.length - 1]
}

export const getEditorUrl = (project: Details): string => {
  if (!project) {
    throw new Error("No provided project.")
  }

  return "/projects/" + project.id
}
