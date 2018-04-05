import { guid, StringMap } from "lib/utils"
import { getSearches } from "lib/search"

import { importProjects } from "./importProjects"
import { createBlankFiles, createHyperappFiles } from "./createFiles"
import { Actions, File, Owner, Project, Details, Template } from "./api"
import { HYPERAPP_NAME, LOCAL_PROJECT_ID } from "./constants"

// set in configs/
declare const HYPERAPP_ID: string

export interface Payload {
  fetch: (id: string) => Promise<Project>
  name?: string
  owner?: Owner
  template: Template
}

export function createProject(payload: Payload): Promise<Project> {
  const { fetch, name = "new-project", owner, template } = payload
  const local = !owner
  const id = local ? LOCAL_PROJECT_ID : payload.owner.id + "-" + guid()

  const details: Details = {
    id,
    name,
    owner: payload.owner,
    searches: getSearches(name),
    hidden: false,
    mainFile: "index.js"
  }

  const files =
    template === "hyperapp" ? createHyperappFiles() : createBlankFiles()

  if (template === "hyperapp") {
    let hyperappFiles: StringMap<File>
    return fetch(HYPERAPP_ID).then(hyperapp => {
      return {
        details,
        files: importProjects(files, [
          { name: HYPERAPP_NAME, files: hyperapp.files }
        ]),
        status: { loading: false }
      }
    })
  }
  return Promise.resolve({ details, files, status: { loading: false } })
}
