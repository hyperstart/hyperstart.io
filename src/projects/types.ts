export namespace projects {
  // # Files

  export type FileType = "file" | "folder"

  export interface File {
    id: string
    type: FileType
    name: string
    parent?: string
    content?: string
    url?: string
    artifactId?: string
  }

  export interface Files {
    [id: string]: File
  }

  // # Project

  export interface Owner {
    id: string
    displayName: string
    url?: string
  }

  export interface Details {
    id: string
    name: string
    mainFile?: string
    hidden?: boolean
    url?: string
    version?: string
  }

  export interface ProjectStatus {
    loading?: boolean
    error?: string
  }

  export interface Project {
    details: Details
    state: State
    files?: Files
  }

  // # State

  export interface State {
    [id: string]: Project
  }

  // # Actions

  export interface UpdatedProject {
    id: string
    owner?: Owner
    name?: string
  }

  export interface FileUpdate {
    projectId: string
    id: string
    name?: string
    content?: string
  }

  export interface DeletedFile {
    projectId: string
    fileId: string
  }

  export interface DeletePayload {
    files: DeletedFile[]
  }

  export interface ImportedProject {
    importerId: string
    importedName: string
    files: Files
  }

  export interface Actions {
    // ## Projects
    add(project: Project): Promise<void>
    update(project: UpdatedProject): Promise<void>
    fetch(id: string): Promise<Project>
    // ## Files
    addFiles(files: File[]): Promise<void>
    updateFiles(updates: FileUpdate[]): Promise<void>
    deleteFiles(files: DeletedFile[]): Promise<void>
    importProjects(projects: ImportedProject[]): Promise<void>
  }
}
