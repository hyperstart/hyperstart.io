import { Template, ProjectOwner } from "projects"
import { State, Actions } from "api"
import { createProject as create } from "projects/createProject"
import { replace } from "lib/router"
import { logEvent } from "analytics"
import { getProjectOwner } from "projects/getProjectOwner"

export function createProject(
  state: State,
  actions: Actions,
  template: Template
) {
  return actions.logger.log(
    actions.users
      .ensureUser()
      .then(user => {
        const owner = getProjectOwner(user)
        return create({
          fetchBundles: actions.bundles.getFromNpmPackages,
          template,
          owner
        })
      })
      .then(project => {
        actions.editor.open(project)
        replace("/projects/" + project.details.id)
        logEvent("create_project", {
          event_category: "project",
          event_label: "Create" + template + "ProjectFromIndex"
        })
      })
  )
}
