// import firebase from "firebase"

// import { Store } from "lib/store"
// import { set } from "lib/immutable"

// import * as api from "../api"
// import { COLLECTION } from "../constants"

// export function add(
//   state: api.State,
//   setProject: any,
//   store: Store,
//   project: api.Project
// ): Promise<api.Project> {
//   const id = project.details.id
//   const filesRef = firebase.storage().ref(`projects/files/${id}.json`)

//   let result: api.Project
//   return filesRef
//     .putString(JSON.stringify(result.files))
//     .then(snapshot => {
//       result = set(project, ["details", "fileUrl"], snapshot.downloadURL)

//       // store project details in firestore
//       return store.update({
//         toSet: [
//           {
//             collection: COLLECTION,
//             id,
//             document: result.details
//           }
//         ]
//       })
//     })
//     .then(() => {
//       // update cache
//       setProject({ id, project: result })
//       return result
//     })
// }
