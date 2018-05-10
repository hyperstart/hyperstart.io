import { h } from "hyperapp"

import { Link, push } from "lib/router"
import { Button } from "lib/components"
import { SearchField } from "lib/search/SearchField"

import { Status, LogFn } from "logger"
import { State, Actions } from "api"
import { isLoading } from "selectors"
import {
  isEditorDirty,
  isDebuggable,
  canExecuteMonacoAction
} from "editor/selectors"
import { UserIconButton } from "users/UserIconButton"

import "./Header.scss"
import { forkProject } from "forkProject"
import { hasDebugRuns } from "editor/debug/selectors"

export interface HeaderProps {
  state: State
  actions: Actions
  log: LogFn
}

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
    text: " Run",
    class: `button ${
      isDebuggable(state.editor) ? "btn-secondary" : "btn-primary"
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
        class="btn-primary"
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
      class="button btn-secondary mr-1"
    />
  )
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
    disabled: isLoading(state),
    onclick: () => {
      forkProject(state, actions, toFork)
    },
    text: "Fork",
    class: "fork-button btn-secondary"
  })
}

export function Header(props: HeaderProps) {
  const { state, actions, log } = props
  return (
    <header class="header navbar">
      <section class="navbar-section">
        <Link href="/" class="navbar-brand mr-2 p-2 text-light logo">
          <strong>Hyper</strong>start
        </Link>
        {SaveButton(props)}
        {RunButton(props)}
        {DebugButton(props)}
        {FormatButton(props)}
      </section>
      <section class="navbar-section">
        {Status({ state: state.logger, actions: actions.logger })}
      </section>
      <section class="navbar-section">
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
    </header>
  )
}
