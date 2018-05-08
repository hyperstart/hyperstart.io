import * as functions from "firebase-functions"
import * as corsFn from "cors"

import { fetchVersions } from "./npm"
import { getErrorMessage } from "./utils"
import { exists } from "./unpkg"

function getUrlParameter(
  request: functions.Request,
  response: functions.Response,
  name: string,
  optional: boolean = false
): string | null {
  const result = request.query[name] || null
  if (!result && !optional) {
    response
      .status(400)
      .send(`please specify the ${name} URL parameter: url?${name}=value`)
  }

  return result
}

const cors = corsFn({ origin: true })

export const getNpmPackageVersions = functions.https.onRequest(
  (request, response) => {
    const pkg = getUrlParameter(request, response, "package")
    if (!pkg) {
      return
    }

    return cors(request, response, () => {
      exists(pkg)
        .then(exists => {
          if (!exists) {
            return []
          }
          return fetchVersions(pkg)
        })
        .then(versions => {
          response.status(200)
          response.contentType("application/json")
          response.send(versions)
        })
        .catch(e => {
          response.status(500).send(getErrorMessage(e))
        })
    })
  }
)

/* this works fine, but it's just simpler to bundle on the client for now.
import * as admin from "firebase-admin"
import { bundle } from "./bundle"

admin.initializeApp()

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
        const file = admin
          .storage()
          .bucket()
          .file(`bundles/${pkg}@${version}.json`)

        return file
          .save(JSON.stringify(bundle), {
            resumable: false,
            predefinedAcl: "publicRead",
            metadata: { contentType: "application/json" }
          })
          .then(() => bundle)
      })
      .then(bundle => {
        response.contentType("application/json")
        response.send(bundle)
      })
      .catch(e => {
        response.status(500).send(getErrorMessage(e))
      })
  }
)
*/

// admin
//   .firestore()
//   .doc(`bundles/${pkg}@${version}`)
//   .set({ test: true })
//   .then(() => {
//     response.contentType("application/json")
//     response.send("Done.")
//   })
//   .catch(e => {
//     response.status(500).send(getErrorMessage(e))
//   })

// admin
//   .firestore()
//   .doc(`bundles/${pkg}@${version}`)
//   .get()
//   .then(doc => doc.data())
//   .then(data => {
//     // if (data) {

//     //   response.redirect(data.bundleUrl)
//     //   return null
//     // }

//     return bundle(pkg, version)
//   })
