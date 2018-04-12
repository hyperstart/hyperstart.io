import { h } from "hyperapp"

import { Match } from "lib/router"

import { State, Actions } from "api"

export interface UserDetailsPageProps {
  state: State
  actions: Actions
  match: Match
}

export function UserDetailsPage(props: UserDetailsPageProps) {
  const text = "world"
  return <div>Hello {text}</div>
}
