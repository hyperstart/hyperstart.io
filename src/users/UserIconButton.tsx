import { h } from "hyperapp"

import { Button } from "lib/components"

import { State, Actions } from "./api"

declare const ui

export interface UserIconButtonProps {
  state: State
  actions: Actions
}

export function UserIconButton(props: UserIconButtonProps) {
  const { state, actions } = props
  const user = state.user
  if (user) {
    const logout = (e: Event) => {
      actions.signOut()
      e.preventDefault()
    }
    return (
      <div class="dropdown dropdown-right">
        <Button
          primary={true}
          icon="caret-down"
          text={user.displayName + " "}
          iconRight={true}
          class="dropdown-toggle"
        />
        <ul class="menu">
          <li class="menu-item">
            <a href="#" onclick={logout} style={{ color: "black" }}>
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div class="dropdown dropdown-right">
      <Button
        primary={true}
        icon="caret-down"
        text="User "
        iconRight={true}
        class="dropdown-toggle"
      />
      <ul class="menu">
        <li class="menu-item">
          <a
            href="#"
            onclick={actions.showSignUpModal}
            style={{ color: "black" }}
          >
            Sign Up
          </a>
          <a
            href="#"
            onclick={actions.showSignInModal}
            style={{ color: "black" }}
          >
            Sign In with Email
          </a>
          <a
            href="#"
            onclick={actions.signInWithGoogle}
            style={{ color: "black" }}
          >
            Sign In with Google
          </a>
        </li>
      </ul>
    </div>
  )
}
