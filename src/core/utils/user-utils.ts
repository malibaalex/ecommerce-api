import { User as PrismaUser } from "@/generated/prisma/client.js"
import { GoogleUser } from "@/types/user.js"

/**
- Arrow function utility to check whether a given user record contains Google identity claims.
- Returns true if the object has a valid googleSub property associated with it.
 */
const isGoogleUser = (user: PrismaUser | GoogleUser): user is GoogleUser => {
  return (
    "googleSub" in user && typeof (user as GoogleUser).googleSub === "string"
  )
}

export default isGoogleUser
