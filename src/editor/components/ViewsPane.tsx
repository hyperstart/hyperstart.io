import { h } from "hyperapp"

import { Tab, TabItem } from "lib/components"

import { User } from "users"

import { State, Actions } from "../api"
import { PROJECT_TAB_ID, OUTPUT_TAB_ID } from "../constants"

import { ProjectTab } from "./ProjectTab"
import { OutputTab } from "./OutputTab"

// # Tabs

interface ViewTab {
  name: string
  id: string
}

const ARTIFACT_TAB_NAME = "Project"
const PREVIEW_TAB_NAME = "Output"

const getTabs = (state: State): ViewTab[] => {
  if (state.project && state.project.mainFile) {
    return [
      {
        id: PROJECT_TAB_ID,
        name: ARTIFACT_TAB_NAME
      },
      {
        id: OUTPUT_TAB_ID,
        name: PREVIEW_TAB_NAME
      }
    ]
  }
  return [
    {
      id: PROJECT_TAB_ID,
      name: ARTIFACT_TAB_NAME
    }
  ]
}

// # ViewsPaneContent

interface ViewsPaneContentProps {
  state: State
  actions: Actions
  tab: ViewTab
  currentUser: User | null
}

const ViewsPaneContent = (props: ViewsPaneContentProps) => {
  if (!props.tab) {
    return "No tab selected."
  }

  switch (props.tab.id) {
    case PROJECT_TAB_ID:
      return ProjectTab(props)
    case OUTPUT_TAB_ID:
      return OutputTab(props)
    default:
      return "Unknown selected tab"
  }
}

// # ViewsPane

export interface ViewsPaneProps {
  state: State
  actions: Actions
  currentUser: User | null
}

export const ViewsPane = (props: ViewsPaneProps) => {
  const { state, actions } = props
  const tabs = getTabs(state)
  const tabItems = tabs.map(tab => {
    const onClick = (e: Event) => {
      e.preventDefault()
      actions.ui.selectViewPaneTab(tab.id)
    }
    return (
      <TabItem active={tab.id === state.ui.selectedViewPaneTab}>
        <a href="#" onclick={onClick}>
          {tab.name}
        </a>
      </TabItem>
    )
  })

  const selectedTab = tabs.find(tab => tab.id === state.ui.selectedViewPaneTab)

  return (
    <div class="views-pane">
      <Tab>{tabItems}</Tab>
      <ViewsPaneContent {...props} tab={selectedTab} />
    </div>
  )
}
