import { guid, StringMap } from "lib/utils"
import { getSearches } from "lib/search"

import { importProjects } from "./importProjects"
import { createBlankFiles, createHyperappFiles } from "./createFiles"
import { Actions, File, Owner, Project, Details, Template } from "./api"
import { LOCAL_PROJECT_ID } from "./constants"
import { Bundle } from "lib/bundle"
import { importBundle } from "./importBundle"

export interface FetchBundlePayload {
  name: string
  version?: string
}

export interface Payload {
  fetch: (payload: FetchBundlePayload) => Promise<Bundle>
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
    mainFile: "/index.js"
  }

  const files =
    template === "hyperapp" ? createHyperappFiles() : createBlankFiles()

  if (template === "hyperapp") {
    return fetch({ name: "hyperapp", version: "1.2.5" }).then(hyperapp => {
      return {
        details,
        files: importBundle(files, hyperapp)
      }
    })
  }
  return Promise.resolve({ details, files })
}
