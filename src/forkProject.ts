import { Project, ProjectOwner } from "projects"
import { State, Actions } from "api"
import { copyProject } from "projects/copyProject"
import { replace } from "lib/router"
import { logEvent } from "analytics"

export function forkProject(state: State, actions: Actions, project: Project) {
  return actions.logger.log(
    actions.users.getCurrentUser().then(user => {
      const owner: ProjectOwner = {
        id: user.id,
        displayName: user.displayName
      }
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
