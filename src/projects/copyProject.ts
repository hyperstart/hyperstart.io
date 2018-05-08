import { Project, ProjectOwner } from "./api"
import { guid } from "lib/utils"

export function copyProject(project: Project, newOwner: ProjectOwner): Project {
  return {
    details: {
      id: guid(),
      name: project.details.name,
      hidden: true,
      searches: {},
      owner: newOwner,
      mainPath: project.details.mainPath,
      filesUrls: null
    },
    files: project.files
  }
}
