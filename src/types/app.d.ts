import "pino-http"
import { NextFunction, Request, Response, Router } from "express"
import { User } from "@/generated/prisma/client.js"

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete"

export interface IController {
  execute: (req: Request, res: Response) => Promise<void>
}

export interface IMiddleware {
  run: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export type IValidator = IMiddleware

export interface IRoute {
  path: string
  router: Router
}

export interface RateLimitOptions {
  windowMs: number
  limit: number
  keyGenerator?: (req: Request) => string
  message?: string
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: User
    }
  }
}
