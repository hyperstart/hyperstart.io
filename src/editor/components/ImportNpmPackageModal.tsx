import { h } from "hyperapp"

import { State, Actions } from "../api"
import { LogFn } from "logger"

import "./ImportNpmPackageModal.scss"
import { FormField, ModalForm } from "lib/form"

export interface ImportNpmPackageModalProps {
  state: State
  actions: Actions
  log: LogFn
}

export function ImportNpmPackageModal(props: ImportNpmPackageModalProps) {
  const { state, actions, log } = props
  const modal = state.ui.importNpmPackageModal
  if (!modal) {
    return <div />
  }

  const oncancel = e => {
    e.preventDefault()
    actions.ui.closeImportNpmPackageModal()
  }

  const onsubmit = e => {
    // const project = modal.selected
    // if (project) {
    //   e.preventDefault()
    //   log(actions.importProjects([project]))
    // }
    e.preventDefault()
    actions.ui.closeImportNpmPackageModal()
  }

  return ModalForm({
    state: modal,
    actions: actions.ui.importNpmPackageModal,
    active: true,
    close: actions.ui.closeImportNpmPackageModal,
    title: "Import package from npm",

    submit: null,
    fields: [
      { name: "name", type: "text", placeholder: "Package name" },
      { name: "version", type: "text", placeholder: "Package version" }
    ],
    horizontal: null
  })

  // return (
  //   <div class="modal active import-npm-package-modal">
  //     <a
  //       href="#"
  //       class="modal-overlay"
  //       aria-label="Close"
  //       onclick={actions.ui.closeImportNpmPackageModal}
  //     />
  //     <div class="modal-container">
  //       <div class="modal-header">
  //         <a
  //           href="#"
  //           class="btn btn-clear float-right"
  //           aria-label="Close"
  //           onclick={actions.ui.closeImportProjectDialog}
  //         />
  //         <h3 class="modal-title">Add Npm Package</h3>
  //       </div>
  //       <div class="modal-body">

  //       </div>
  //       <div class="modal-footer">
  //         <button
  //           class={
  //             "btn btn-primary float-right" /*+ (modal.selected ? "" : " disabled")*/
  //           }
  //           onclick={onsubmit}
  //         >
  //           Add
  //         </button>
  //         <button class="btn btn-secondary float-right" onclick={oncancel}>
  //           Cancel
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // )
}
