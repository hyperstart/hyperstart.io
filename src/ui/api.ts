import { ModuleActions } from "api"
import { Template } from "projects/api"

// # State

export interface CreateProjectModal {
  template: Template
}

export interface State {
  createProjectModal?: CreateProjectModal
  createProjectTemplate: Template
}

// # Actions

export interface Actions {
  // ## Create Project Modal
  openCreateProjectModal()
  selectCreateProjectModalTemplate(template: Template)
  closeCreateProjectModal()
  // ## Create Project
  selectCreateProjectTemplate(template: Template)
}
