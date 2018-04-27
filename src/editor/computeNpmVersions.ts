import { getLatestVersion } from "lib/unpkg"
import { debounce } from "lib/utils"

import { Actions as BundleActions } from "bundles"
import { State, Actions } from "./api"

function _computeNpmVersions(
  bundleActions: BundleActions,
  state: State,
  actions: Actions
) {
  const modal = state.ui.importNpmPackageModal
  if (!modal) {
    return
  }

  const pkg = modal.name.value
  if (pkg === "") {
    return
  }

  actions.ui.importNpmPackageModal.set({
    fields: {
      name: {
        error: null
      },
      version: {
        options: [],
        value: "",
        loading: true
      }
    }
  })
  if (modal.latest.value === "latest") {
    // get latest version
    getLatestVersion(pkg)
      .then(version => {
        if (!state.ui.importNpmPackageModal) {
          return
        }

        if (!version) {
          throw "No package..."
        }

        const options = [{ value: version, label: version }]
        actions.ui.importNpmPackageModal.set({
          fields: {
            name: {
              error: null
            },
            version: {
              options,
              value: version,
              loading: false
            }
          }
        })
      })
      .catch(e => {
        if (
          !state.ui.importNpmPackageModal ||
          state.ui.importNpmPackageModal.version.loading
        ) {
          return
        }

        actions.ui.importNpmPackageModal.set({
          fields: {
            name: {
              error: `No npm package found with name ${pkg}.`
            },
            version: {
              options: [],
              value: "",
              loading: false
            }
          }
        })
      })
  } else {
    // get all versions
    bundleActions
      .getVersions(pkg)
      .then(versions => {
        if (!state.ui.importNpmPackageModal) {
          return
        }

        if (versions.length === 0) {
          throw "No package..."
        }
        const options = versions.map(v => ({ value: v, label: v })).reverse()
        actions.ui.importNpmPackageModal.set({
          fields: {
            name: {
              error: null
            },
            version: {
              options,
              value: options[0].value,
              loading: false
            }
          }
        })
      })
      .catch(e => {
        if (
          !state.ui.importNpmPackageModal ||
          state.ui.importNpmPackageModal.version.loading
        ) {
          return
        }

        actions.ui.importNpmPackageModal.set({
          fields: {
            name: {
              error: `No npm package found with name ${pkg}.`
            },
            version: {
              options: [],
              value: "",
              loading: false
            }
          }
        })
      })
  }
}
export const computeNpmVersions = debounce(_computeNpmVersions, 300)
