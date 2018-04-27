import { Project, Owner } from "./api"
import { guid } from "lib/utils"
import { LOCAL_PROJECT_ID } from "."

export function copyProject(project: Project, newOwner: Owner): Project {
  return {
    details: {
      ...project.details,
      id: newOwner ? newOwner.id + "-" + guid() : LOCAL_PROJECT_ID,
      owner: newOwner
    },
    files: project.files
  }
}
