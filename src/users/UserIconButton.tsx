import { h } from "hyperapp"

import { Button, Icon } from "lib/components"

import { State, Actions } from "./api"
import { LogFn } from "logger"

declare const ui

export interface UserIconButtonProps {
  state: State
  actions: Actions
  log: LogFn
}

export function UserIconButton(props: UserIconButtonProps) {
  const { state, actions, log } = props
  const user = state.user
  if (user) {
    const logout = (e: Event) => {
      actions.signOut()
      e.preventDefault()
    }
    return (
      <div class="dropdown dropdown-right user-icon-button">
        <a class="btn dropdown-toggle btn-secondary" tabindex="0">
          {user.displayName + " "}
          <Icon name="caret-down" />
        </a>
        <ul class="menu">
          <li class="menu-item">
            <a href="#" onclick={logout}>
              Sign Out
            </a>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div class="dropdown dropdown-right user-icon-button">
      <a class="btn dropdown-toggle btn-secondary" tabindex="0">
        User <Icon name="caret-down" />
      </a>
      <ul class="menu">
        <li class="menu-item">
          <a href="#" onclick={actions.showSignUpModal}>
            Sign Up
          </a>
        </li>
        <li class="menu-item">
          <a href="#" onclick={actions.showSignInModal}>
            Sign In with Email
          </a>
        </li>
        <li class="menu-item">
          <a href="#" onclick={() => log(actions.signInWithGoogle())}>
            Sign In with Google
          </a>
        </li>
        <li class="menu-item">
          <a href="#" onclick={() => log(actions.signInWithGithub())}>
            Sign In with Github
          </a>
        </li>
      </ul>
    </div>
  )
}
