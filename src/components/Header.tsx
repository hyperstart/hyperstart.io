import { h } from "hyperapp"

import { Link, push } from "lib/router"
import { Button, Icon, Dropdown, DropdownItem } from "lib/components"
import { SearchField } from "lib/search/SearchField"

import { Status, LogFn } from "logger"
import { State, Actions } from "api"
import { isLoading, isInIframe } from "selectors"
import {
  isEditorDirty,
  isDebuggable,
  canExecuteMonacoAction,
  isForkEnabled
} from "editor/selectors"
import { UserIconButton } from "users/UserIconButton"

import "./Header.scss"
import { hasDebugRuns } from "editor/debug/selectors"
import { getEditorUrl } from "utils"

export interface HeaderProps {
  state: State
  actions: Actions
  log: LogFn
}

// # Buttons

function CreateButton({ state, actions }: HeaderProps) {
  if (state.editor.status !== "closed") {
    return null
  }

  return Button({
    disabled: isLoading(state),
    onclick: actions.ui.openCreateProjectModal,
    text: window.innerWidth < 840 ? "Create" : "Create a Project",
    class: "button btn-primary ml-2"
  })
}

function SaveButton({ state, actions }: HeaderProps) {
  const editor = state.editor
  if (editor.status === "closed" || editor.status === "read-only") {
    return null
  }

  return Button({
    disabled: !isEditorDirty(state.editor) || isLoading(state),
    onclick: () => actions.logger.log(actions.editor.saveProject),
    text: "Save",
    class: "button btn-secondary mr-1"
  })
}

function RunButton({ state, actions }: HeaderProps) {
  const project = state.editor.project
  if (state.editor.status === "closed" || !project.details.mainPath) {
    return null
  }

  return Button({
    disabled: isLoading(state),
    onclick: () => actions.editor.run(false),
    text: "Run",
    class: `button ${
      isDebuggable(state.editor) ? "btn-secondary hide-sm" : "btn-primary"
    } mr-1`
  })
}

function DebugButton({ state, actions }: HeaderProps) {
  if (!isDebuggable(state.editor)) {
    return null
  }

  const debugState = state.editor.debug
  return (
    <div class="btn-group btn-group-block button btn-debug">
      <Button
        disabled={isLoading(state)}
        onclick={() => actions.editor.run(true)}
        text="Debug"
        class="btn-primary"
      />
      <Button
        disabled={isLoading(state) || !hasDebugRuns(state.editor.debug)}
        active={debugState.paneShown}
        onclick={() => actions.editor.debug.showPane(!debugState.paneShown)}
        icon="caret-down"
        class="btn-primary mr-1"
      />
    </div>
  )
}

function FormatButton({ state, actions }: HeaderProps) {
  const project = state.editor.project
  if (state.editor.status === "closed") {
    return null
  }

  return (
    <Button
      disabled={!canExecuteMonacoAction(state.editor)}
      onclick={() =>
        actions.editor.executeAction("editor.action.formatDocument")
      }
      text="Format"
      class="button btn-secondary hide-lg"
    />
  )
}

function EmbedButton({ state, actions }: HeaderProps) {
  if (state.editor.status === "closed") {
    return null
  }
  return Button({
    disabled: state.editor.status === "local-only",
    onclick: actions.editor.ui.openEmbedModal,
    text: "Embed",
    class: "btn-secondary hide-lg mr-1"
  })
}

function ForkButton({ state, actions }: HeaderProps) {
  if (state.editor.status === "closed") {
    return null
  }
  const toFork = state.editor.project
  if (!toFork) {
    return null
  }

  return Button({
    disabled: !isForkEnabled(state.editor) || isLoading(state),
    onclick: () => actions.logger.log(actions.editor.fork()),
    text: "Fork",
    class: "fork-button btn-secondary hide-lg"
  })
}

// # Header Link

function HeaderLink({ state }: HeaderProps) {
  if (isInIframe()) {
    const url = window.location.href
    const search = window.location.search
    const href = url.substring(0, url.length - search.length)
    return (
      <a
        href={href}
        target="_blank"
        class="navbar-brand mr-2 p-2 text-light logo"
      >
        <small>Edit in</small> <strong>Hyper</strong>start
      </a>
    )
  }

  return (
    <Link href="/" class="navbar-brand mr-2 p-2 text-light logo">
      <span class="hide-md">
        <strong>Hyper</strong>start
      </span>
      <span class="show-md">
        <strong>H</strong>s
      </span>
    </Link>
  )
}

function ActionsButton(props: HeaderProps) {
  const { state, actions } = props
  if (state.editor.status === "closed") {
    return null
  }

  return (
    <Dropdown text="Actions" class="actions-button show-lg" right>
      {isDebuggable(state.editor) && (
        <DropdownItem
          text="Run"
          class="show-sm"
          disabled={isLoading(state)}
          onclick={() => actions.editor.run(false)}
        />
      )}
      <DropdownItem divider class="show-sm" />
      <DropdownItem
        text="Format"
        disabled={!canExecuteMonacoAction(state.editor)}
        onclick={() =>
          actions.editor.executeAction("editor.action.formatDocument")
        }
      />
      <DropdownItem divider />
      <DropdownItem
        text="Embed"
        disabled={state.editor.status === "local-only"}
        onclick={actions.editor.ui.openEmbedModal}
      />
      <DropdownItem
        text="Fork"
        disabled={!isForkEnabled(state.editor) || isLoading(state)}
        onclick={() => actions.logger.log(actions.editor.fork())}
      />
    </Dropdown>
  )
}

// # Left Section

function LeftNavSection(props: HeaderProps) {
  return (
    <section class="navbar-section">
      {HeaderLink(props)}
      {SaveButton(props)}
      {RunButton(props)}
      {DebugButton(props)}
      {FormatButton(props)}
      {ActionsButton(props)}
    </section>
  )
}

// # Right Section

function RightNavSection(props: HeaderProps) {
  const { state, actions, log } = props
  if (isInIframe()) {
    return null
  }

  return (
    <section class="navbar-section">
      {EmbedButton(props)}
      {ForkButton(props)}

      {SearchField({
        state: state.search,
        actions: actions.search,
        log,
        onSearch: () => {
          push("/projects")
        },
        name: "projects",
        placeholder: "Search projects...",
        class: "hide-md"
      })}
      {CreateButton(props)}
      {UserIconButton({
        state: state.users,
        actions: actions.users,
        log: actions.logger.log
      })}
    </section>
  )
}

export function Header(props: HeaderProps) {
  const { state, actions, log } = props
  return (
    <header class="header navbar">
      {LeftNavSection(props)}
      <section class="navbar-section">
        {Status({ state: state.logger, actions: actions.logger })}
      </section>
      {RightNavSection(props)}
    </header>
  )
}
