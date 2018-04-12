import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { isMacOS } from "utils"

import "./ShortcutModal.scss"

export interface ShortcutsModalProps {
  state: State
  actions: Actions
}

function getShorcutText(key: string, ctrl: boolean): string {
  if (ctrl) {
    const code = isMacOS() ? "⌘+" : "Ctrl+"
    return code + key
  }

  return key
}

export function ShortcutsModal(props: ShortcutsModalProps) {
  if (!props.state.ui.shortcutsModal) {
    return <div />
  }

  const hide = props.actions.ui.hideShortcutsModal
  return (
    <Modal
      close={hide}
      title="Shortcuts"
      titleTag="h1"
      class="shortcut-modal"
      active
    >
      <h3>Editor</h3>
      <ul>
        <li>
          <code>{getShorcutText("S", true)}</code> Save all sources
        </li>
        <li>
          <code>{getShorcutText("R", true)}</code> Run project
        </li>
        <li>
          <code>{getShorcutText("D", true)}</code> Debug project
        </li>
      </ul>
    </Modal>
  )
}
