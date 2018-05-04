import { ProjectDetails } from "projects"

export function getExtension(id: string): string {
  const segments = (id || "").split(".")
  if (segments.length === 0) {
    throw new Error('Cannot get extension from bundle ID: "' + id + '"')
  }
  return segments[segments.length - 1]
}

export function getEditorUrl(project: ProjectDetails): string {
  if (!project) {
    throw new Error("No provided project.")
  }

  return "/projects/" + project.id
}

const MAC_OS_PLATFORMS = {
  Macintosh: true,
  MacIntel: true,
  MacPPC: true,
  Mac68K: true
}

export function isMacOS() {
  const platform = window.navigator.platform
  return !!MAC_OS_PLATFORMS[platform]
}
