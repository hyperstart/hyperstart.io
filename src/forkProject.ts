import { Project, ProjectOwner } from "projects"
import { State, Actions } from "api"
import { copyProject } from "projects/copyProject"
import { replace } from "lib/router"
import { logEvent } from "analytics"
import { getProjectOwner } from "projects/getProjectOwner"

export function forkProject(state: State, actions: Actions, project: Project) {
  return actions.logger.log(
    actions.users.ensureUser().then(user => {
      const owner = getProjectOwner(user)
      const newProject = copyProject(project, owner)
      actions.editor.open(newProject)
      replace("/projects/" + newProject.details.id)

      logEvent("fork_project", {
        event_category: "project",
        event_label: "Fork"
      })
    })
  )
}
