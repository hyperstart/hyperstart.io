"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const npm_1 = require("./npm");
const utils_1 = require("./utils");
const bundle_1 = require("./bundle");
admin.initializeApp();
function getUrlParameter(request, response, name, optional = false) {
    const result = request.query[name] || null;
    if (!result && !optional) {
        response
            .status(400)
            .send(`please specify the ${name} URL parameter: url?${name}=value`);
    }
    return result;
}
exports.getNpmPackageVersions = functions.https.onRequest((request, response) => {
    const pkg = getUrlParameter(request, response, "package");
    if (!pkg) {
        return;
    }
    npm_1.fetchVersions(pkg)
        .then(versions => {
        response.contentType("application/json");
        response.send(versions);
    })
        .catch(e => {
        response.status(500).send(utils_1.getErrorMessage(e));
    });
});
exports.getNpmPackageBundle = functions.https.onRequest((request, response) => {
    const pkg = getUrlParameter(request, response, "package");
    if (!pkg) {
        return;
    }
    const version = getUrlParameter(request, response, "version");
    if (!version) {
        return;
    }
    bundle_1.bundle(pkg, version)
        .then(bundle => {
        const file = admin
            .storage()
            .bucket()
            .file(`bundles/${pkg}@${version}.json`);
        return file
            .save(JSON.stringify(bundle), {
            resumable: false,
            predefinedAcl: "publicRead",
            metadata: { contentType: "application/json" }
        })
            .then(() => bundle);
    })
        .then(bundle => {
        response.contentType("application/json");
        response.send(bundle);
    })
        .catch(e => {
        response.status(500).send(utils_1.getErrorMessage(e));
    });
});
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
//# sourceMappingURL=index.js.map