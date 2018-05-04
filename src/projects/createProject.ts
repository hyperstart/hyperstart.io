import { guid, StringMap } from "lib/utils"
import { getSearches } from "lib/search"

import { importProjects } from "./importProjects"
import { createBlankFiles, createHyperappFiles } from "./createFiles"
import {
  Actions,
  File,
  ProjectOwner,
  Project,
  ProjectDetails,
  Template
} from "./api"
import { Bundle } from "lib/bundle"
import { importBundles } from "./importBundles"
import { NEW_PROJECT_ID } from "."

export interface BundleToFetch {
  name: string
  version: string
}

export interface Payload {
  fetchBundles: (bundles: BundleToFetch[]) => Promise<Bundle[]>
  name?: string
  owner?: ProjectOwner
  template: Template
}

export function createProject(payload: Payload): Promise<Project> {
  const { fetchBundles, name = "", owner, template } = payload

  const details: ProjectDetails = {
    id: NEW_PROJECT_ID,
    name,
    owner: payload.owner,
    searches: name === "" ? {} : getSearches(name),
    hidden: name === "",
    mainPath: "/index.js",
    filesUrls: null
  }

  if (template === "hyperapp") {
    return fetchBundles([{ name: "hyperapp", version: "1.2.5" }]).then(
      bundles => {
        return {
          details,
          files: importBundles(createHyperappFiles(), bundles)
        }
      }
    )
  }
  return Promise.resolve({ details, files: createBlankFiles() })
}
