import * as router from "lib/router"

export interface User {
  id: string
  name: string
  email: string
}

export interface Project {
  id: string
  name: string
  owner: string
}

export interface State {
  router: router.State
  user?: User
  error?: string
  users: User[]
  projects: Project[]
}

export interface FetchProjectPayload {
  user: string
  project: string
}

export interface Actions {
  router: router.Actions
  init()
  login()
  logout()
  fetchProjects()
  fetchProject(payload: FetchProjectPayload)
  fetchUsers()
  fetchUser(name: string)
  createUser()
  createProject(owner: string)
}
