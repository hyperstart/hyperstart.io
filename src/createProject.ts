import { Template, Owner } from "projects"
import { State, Actions } from "api"
import { createProject as create } from "projects/createProject"
import { replace } from "lib/router"
import { logEvent } from "analytics"

export function createProject(
  state: State,
  actions: Actions,
  template: Template
) {
  const user = state.users.user
  const owner: Owner = user
    ? { id: user.id, displayName: user.displayName }
    : null

  return actions.logger.log(
    create({ fetch: actions.projects.fetch, template, owner })
      .then(project => {
        if (state.users.user) {
          return actions.projects.save(project)
        } else {
          return actions.editor.localStore.save(project)
        }
      })
      .then(project => {
        actions.editor.open(project)
        replace("/projects/" + project.details.id)
        logEvent("create_project", { method: "Index" })
      })
  )
}
