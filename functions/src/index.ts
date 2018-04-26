import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

import { fetchVersions } from "./npm"
import { getErrorMessage } from "./utils"
import { bundle } from "./bundle"

function getUrlParameter(
  request: functions.Request,
  response: functions.Response,
  name: string
): string | null {
  const result = request.params[name] || null
  if (!result) {
    response
      .status(400)
      .send(`please specify the ${name} URL parameter: url?${name}=value`)
  }

  return result
}

export const getNpmPackageVersions = functions.https.onRequest(
  (request, response) => {
    const pkg = getUrlParameter(request, response, "package")
    if (!pkg) {
      return
    }
    fetchVersions(pkg)
      .then(versions => {
        response.send(versions)
      })
      .catch(e => {
        response.status(500).send(getErrorMessage(e))
      })
  }
)

export const getNpmPackageBundle = functions.https.onRequest(
  (request, response) => {
    const pkg = getUrlParameter(request, response, "package")
    if (!pkg) {
      return
    }
    const version = getUrlParameter(request, response, "version")
    if (!version) {
      return
    }

    bundle(pkg, version)
      .then(bundle => {
        response.send(bundle)
      })
      .catch(e => {
        response.status(500).send(getErrorMessage(e))
      })
  }
)
