import { concat } from "lib/fs"

import { File, Files } from "./api"
import { importFiles, FilesToImport } from "./importFiles"
import { PackageJson } from "lib/npm"

function getPackageJson(project: ImportedProject): PackageJson {
  return {
    name: project.name,
    version: "master",
    main: project.mainFile || "index.js",
    hyperstart: {
      id: project.id
    }
  }
}

function getFilesToImport(project: ImportedProject): FilesToImport {
  return {
    packageJson: getPackageJson(project),
    files: project.files
  }
}

export interface ImportedProject {
  id: string
  name: string
  files: Files
  mainFile: string
}

export function importProjects(
  files: Files,
  imports: ImportedProject[]
): Files {
  return importFiles(files, imports.map(getFilesToImport))
}
