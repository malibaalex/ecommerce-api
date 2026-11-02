import "pino-http"
import { Router } from "express"
import { User } from "@/generated/prisma/client.js"
import { GoogleIdentity } from "./user.js"

interface IRoute {
  path: string
  router: Router
}

/**
- User row combined with Google identity claims using Omit utility.
- Prevents type clashes where Prisma and Google definitions declare overlapping fields differently.
 */
export interface GoogleUser
  extends Omit<User, keyof GoogleIdentity>, GoogleIdentity {}

declare global {
  namespace Express {
    interface Request {
      currentUser?: GoogleUser | User
    }
  }
}
