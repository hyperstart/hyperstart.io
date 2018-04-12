import { h } from "hyperapp"

import { replace, Link, Routes, Match } from "lib/router"

import * as api from "./api"

interface PageProps {
  state: api.State
  actions: api.Actions
}

interface MatchedPageProps extends PageProps {
  state: api.State
  actions: api.Actions
  match: Match
}

function CurrentUser({ state, actions }: PageProps) {
  if (state.user) {
    return (
      <div>
        Logged in as {state.user.email} -{" "}
        <a href="#" onclick={actions.logout}>
          Log out
        </a>
        <br />
        <br />
      </div>
    )
  }

  return (
    <div>
      Logged out -{" "}
      <a href="#" onclick={actions.login}>
        Log in
      </a>
      <br />
      <br />
    </div>
  )
}

function IndexPage({ state, actions }: PageProps) {
  return (
    <div>
      <CurrentUser state={state} actions={actions} />
      <h1>Index Page</h1>
      <Link href="/users">Users</Link>
      <br />
      <Link href="/projects">Projects</Link>
    </div>
  )
}

function Project(project: api.Project) {
  return (
    <div>
      Project:{" "}
      <Link href={"/" + project.owner + "/" + project.name}>
        {project.name}
      </Link>
      {"  "}
      Owner: <Link href={"/" + project.owner}>{project.owner}</Link>
    </div>
  )
}

function ProjectsPage({ state, actions }: PageProps) {
  return (
    <div>
      <CurrentUser state={state} actions={actions} />
      <h1>Projects Page</h1>
      {state.projects.map(Project)}
      <Link href="/">Back to Index</Link>
    </div>
  )
}

function User(user: api.User) {
  return (
    <div>
      User: <Link href={"/" + user.name}>{user.name}</Link>
    </div>
  )
}

function UsersPage({ state, actions }: PageProps) {
  return (
    <div>
      <CurrentUser state={state} actions={actions} />
      <h1>Users Page</h1>
      {state.users.map(User)}
      <button onclick={actions.createUser}>Add user</button>
      <br />
      <Link href="/">Back to Index</Link>
    </div>
  )
}

function ProjectPage({ state, actions, match }: MatchedPageProps) {
  const user = match.params.user
  const project = match.params.project
  return (
    <div>
      <CurrentUser state={state} actions={actions} />
      <h1>Project: {project}</h1>
      Owner: {user}
      <br />
      <Link href="/">Back to Index</Link>
      <br />
      <Link href="/users">Back to Users</Link>
      <br />
      <Link href="/projects">Back to Projects</Link>
      <br />
    </div>
  )
}

function UserPage({ state, actions, match }: MatchedPageProps) {
  const user = match.params.user
  return (
    <div>
      <CurrentUser state={state} actions={actions} />
      <h1>User: {user}</h1>
      {state.projects.map(Project)}
      <button onclick={() => actions.createProject(user)}>Add project</button>
      <br />
      <Link href="/">Back to Index</Link>
      <br />
      <Link href="/users">Back to Users</Link>
      <br />
    </div>
  )
}

export function view(state: api.State, actions: api.Actions) {
  return Routes({
    routeProps: { state, actions },
    routes: [
      { path: "/", view: IndexPage, exact: true },
      { path: "/users", view: UsersPage, exact: true },
      { path: "/projects", view: ProjectsPage, exact: true },
      { path: "/:user", view: UserPage, exact: true },
      { path: "/:user/:project", view: ProjectPage, exact: true },
      { path: "*", view: () => replace("/") && "Redirecting..." }
    ]
  })
}
