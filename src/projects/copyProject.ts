import { Project, Owner } from "./api"
import { guid } from "lib/utils"

export function copyProject(project: Project, newOwner: Owner): Project {
  return {
    details: {
      ...project.details,
      id: guid(),
      owner: newOwner
    },
    status: {},
    files: project.files
  }
}
