import { User } from "users"
import { ProjectOwner } from "./api"

export function getProjectOwner(user: User | null): ProjectOwner {
  return user
    ? {
        id: user.id,
        displayName: user.displayName,
        anonymous: user.anonymous
      }
    : null
}
