# Store

This folder is not a module!
This folder contains:

* [api.ts](./api.ts): the API for a generic `Store` of documents/entities
* [cache.ts](./cache.ts): functions and types to implement a local cache for any store, this file does **not** contain a `Store`.
* [local.ts](./local.ts): a local `Store` that maintains documents/entities in memory
* [firestore.ts](./firestore.ts): a `Store` backed by [Firebase's Firestore](https://firebase.google.com/docs/firestore/)
