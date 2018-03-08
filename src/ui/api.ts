import { ModuleActions } from "api"
import { Template } from "projects/api"

// # State

export interface CreateProjectDialog {
  template: Template
}

export interface State {
  createProject?: CreateProjectDialog
}

// # Actions

export interface Actions {
  // ## Create Project Dialog
  openCreateProject()
  selectCreateProjectTemplate(template: Template)
  closeCreateProject()
}
