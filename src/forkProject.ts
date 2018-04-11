import { Project, Owner } from "projects"
import { State, Actions } from "api"
import { copyProject } from "projects/copyProject"
import { replace } from "lib/router"

export function forkProject(state: State, actions: Actions, project: Project) {
  const user = state.users.user
  const owner: Owner = user
    ? { id: user.id, displayName: user.displayName }
    : null

  const newProject = copyProject(project, owner)
  const projects = state.users.user
    ? actions.projects
    : actions.editor.localStore

  return actions.logger.log(
    projects.save(newProject).then(project => {
      actions.editor.open(project)
      replace("/projects/" + project.details.id)
    })
  )
}
