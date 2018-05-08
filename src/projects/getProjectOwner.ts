import { User } from "users"
import { ProjectOwner } from "./api"

export function getProjectOwner(user: User): ProjectOwner {
  return {
    id: user.id,
    displayName: user.displayName,
    anonymous: user.anonymous
  }
}
