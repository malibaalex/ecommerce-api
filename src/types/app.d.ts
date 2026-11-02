import "pino-http"
import { NextFunction, Request, Response, Router } from "express"
import { User } from "@/generated/prisma/client.js"
import { GoogleIdentity } from "./user.js"

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete"

export interface IController {
  execute: (req: Request, res: Response) => Promise<void>
}

export interface IMiddleware {
  run: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export interface IRoute {
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
