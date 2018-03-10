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
  const user = state.currentUser
  if (user) {
    const logout = (e: Event) => {
      actions.logout()
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

  const createLoginScreen = element => {
    const uiConfig = {
      callbacks: {
        // Called when the user has been successfully signed in, returns false to cancel redirect.
        signInSuccess: (user, credential, redirectUrl) => false
      },
      // Opens IDP Providers sign-in flow in a popup.
      signInFlow: "popup",
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          scopes: ["https://www.googleapis.com/auth/plus.login"]
        },
        // {
        //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //   scopes: ["public_profile", "email", "user_likes", "user_friends"]
        // },
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          // Whether the display name should be displayed in Sign Up page.
          requireDisplayName: true
        }
      ],
      // Terms of service url.
      tosUrl: "https://www.google.com"
    }

    ui.start("#firebaseui-container", uiConfig)
  }

  return (
    <div class="dropdown dropdown-right">
      <Button
        primary={true}
        icon="caret-down"
        text="Log In "
        iconRight={true}
        class="dropdown-toggle"
      />
      <div
        class="menu"
        oncreate={createLoginScreen}
        id="firebaseui-container"
        style={{ width: "300px", height: "320px", "max-height": "320px" }}
      />
    </div>
  )
}
