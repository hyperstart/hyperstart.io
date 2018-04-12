// export interface FirebaseUserMetadata {
//   creationTime?: string
//   lastSignInTime?: string
// }

// interface FirebaseUserInfo {
//   displayName: string | null
//   email: string | null
//   phoneNumber: string | null
//   photoURL: string | null
//   providerId: string
//   uid: string
// }

// export interface FirebaseUser extends FirebaseUserInfo {
//   emailVerified: boolean
//   isAnonymous: boolean
//   refreshToken: string
//   metadata: FirebaseUserMetadata
//   providers: FirebaseUserInfo[]
// }

// export type Provider = "email" | "google" | "github"

// export interface User {
//   type: "user"
//   name: string
//   providers: Provider[]
//   uid: string
// }

// export interface Organisation {
//   type: "organisation"
//   name: string
// }

// export type ProjectOwner = User | Organisation

// export type OrganisationUserLevel = "admin" | "member"

// export interface OrganisationUser {
//   organisation: string
//   user: string
//   level: OrganisationUserLevel
//   //
//   confirmed: boolean
// }

// export interface UsersState {
//   firebaseUser?: FirebaseUser
//   user?: User
// }

// export interface OrganisationsState {
//   [name: string]: Organisation
// }

// const user = ""
// const organisation = ""
// const owner = user || organisation
// const project = ""
// const version = ""
// const file = ""
// const keyword = ""

// const urls = [
//   `/projects`, // show list of all projects
//   `/keywords`,
//   `/${user}`, // user page
//   `/${organisation}`, // org page
//   `/${owner}/${project}`, // project page, with all versions, redirect to latest version
//   `/${owner}/${project}/latest`, // project page, latest version
//   `/${owner}/${project}/${version}`,  // project page, with given version, version = X.Y.Z || "latest"
//   `/${owner}/${project}/versions`,  // show list of versions
// ]

// const database = [
//   `/owners/${owner}`, // project owners: organisation or user
//   `/owners/${owner}/projects/${project}`, // owner's project -> name, type and list of versions
//   `/owners/${owner}/projects/${project}/versions/${version}`, // specific version of a project
//   `/owners/${owner}/projects/${project}/versions/${version}/files/${file}`, // a single file of a project
//   `/keywords/${keyword}`
// ]
