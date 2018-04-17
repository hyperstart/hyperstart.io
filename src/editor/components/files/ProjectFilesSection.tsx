import { h } from "hyperapp"

import { File, FileNode, FolderNode, SourceNode } from "projects"
import { LogFn } from "logger"

import { State, Actions } from "../../api"
import { getPreviewedFile } from "../../selectors"
import { CreateFileModal } from "./CreateFileModal"
import { DeleteFileModal } from "./DeleteFileModal"
import { FileTree } from "./FileTree"
import { FilePreview } from "./FilePreview"
import { HeaderMenu } from "./HeaderMenu"
import { Button } from "lib/components"

export interface ProjectFilesSectionProps {
  state: State
  actions: Actions
  log: LogFn
}

function FilesActions(props: ProjectFilesSectionProps) {
  const actions = props.actions.ui
  return (
    <div class="float-right">
      <Button
        icon="file-text-o"
        onclick={() => actions.openCreateFileModal({ type: "file" })}
        class="files-section-action"
      />
      <Button
        icon="folder-open-o"
        onclick={() => actions.openCreateFileModal({ type: "folder" })}
        class="files-section-action"
      />
    </div>
  )
}

export const ProjectFilesSection = (props: ProjectFilesSectionProps) => {
  const { state, actions, log } = props
  const file = getPreviewedFile(state)

  function createFile(type: "file" | "folder", name: string, parent?: File) {
    log(actions.createFile({ type, name, parent }))
  }
  function onDeleteFile(file: FileNode) {
    log(actions.deleteFile(file))
  }

  return (
    <div class="m-2 project-files">
      <h2>Files {FilesActions(props)}</h2>
      {file ? FilePreview({ state, actions, file }) : FileTree(props)}
      <DeleteFileModal
        deleting={state.ui.deletingFile}
        close={actions.ui.closeDeleteFileModal}
        confirm={onDeleteFile}
      />
      <CreateFileModal state={state} actions={actions} confirm={createFile} />
    </div>
  )
}
