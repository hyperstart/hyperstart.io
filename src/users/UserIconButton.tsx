import { h } from "hyperapp"

import { Button, Icon } from "lib/components"

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
      <div class="dropdown dropdown-right user-icon-button">
        <a class="btn dropdown-toggle" tabindex="0">
          {user.displayName + " "}
          <Icon name="caret-down" />
        </a>
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
    <div class="dropdown dropdown-right user-icon-button">
      <a class="btn dropdown-toggle" tabindex="0">
        User <Icon name="caret-down" />
      </a>
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
