import { h } from "hyperapp"

import { Modal } from "lib/components"

import { State, Actions } from "./api"
import { getEmbedText } from "./selectors"
import { MonacoEditor, MonacoOptions } from "./monaco"

import "./EmbedModal.scss"

export interface EmbedModalProps {
  state: State
  actions: Actions
}

export function EmbedModal(props: EmbedModalProps) {
  const { state, actions } = props

  if (!state.ui.embedModal) {
    return <div />
  }

  function getOptions(): MonacoOptions {
    return {
      theme: "vs-dark",
      value: getEmbedText(state),
      minimap: { enabled: false },
      codeLens: false,
      scrollBeyondLastLine: false,
      language: "html",
      lineNumbers: "off",
      readOnly: true
    }
  }

  return (
    <Modal
      close={actions.ui.closeEmbedModal}
      title="Embed editor"
      class="embed-modal"
      active
    >
      <MonacoEditor getOptions={getOptions} />
    </Modal>
  )
}
