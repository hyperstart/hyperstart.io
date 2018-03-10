import { guid } from "lib/utils"

import { Store, UpdateResult } from "./api"

// # Utilities

function getCollectionRef(
  collection: string
): firebase.firestore.CollectionReference {
  return firebase.firestore().collection(collection)
}

function getDocRef(
  collection: string,
  id: string
): firebase.firestore.DocumentReference {
  return getCollectionRef(collection).doc(id)
}

// # Store

export function firestore(): Store {
  return {
    getById<T>(payload) {
      const { collection, id } = payload
      return getDocRef(collection, id)
        .get()
        .then(snapshot => {
          if (!snapshot.exists) {
            throw new Error(
              '404: resource with id "' + id + '" does not exist.'
            )
          }
          return <T>snapshot.data()
        })
    },
    query<T>(payload) {
      let ref: firebase.firestore.Query = getCollectionRef(payload.collection)
      if (payload.where) {
        payload.where.forEach(where => {
          ref = ref.where(where.attribute, where.op, where.value)
        })
      }
      if (payload.orderBy) {
        ref = ref.orderBy(
          payload.orderBy.attribute,
          payload.orderBy.descending ? "desc" : "asc"
        )
      }
      if (payload.first) {
        ref = ref.startAt(payload.first)
      }
      if (payload.limit) {
        ref = ref.limit(payload.limit)
      }
      return ref.get().then(snapshot => {
        return snapshot.docs.map(doc => <T>doc.data())
      })
    },
    update(payload) {
      const { toSet = [], toDelete = [], toUpdate = [] } = payload
      const batch = firebase.firestore().batch()

      const result: UpdateResult = { set: [], updated: [], deleted: [] }
      toSet.forEach(toSet => {
        const { collection, document, id = guid() } = toSet
        batch.set(getDocRef(collection, id), document)
        result.set.push({ id, document, collection })
      })

      toUpdate.forEach(toUpdate => {
        const { collection, document, id } = toUpdate
        batch.update(getDocRef(collection, id), document)
        result.updated.push({ id, document, collection })
      })

      toDelete.forEach(toDelete => {
        const { collection, id } = toDelete
        batch.delete(getDocRef(collection, id))
        result.deleted.push({ id, collection })
      })

      return batch.commit().then(() => result)
    }
  }
}
