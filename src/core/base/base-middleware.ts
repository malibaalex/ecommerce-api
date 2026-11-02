import { NextFunction, Request, Response } from "express"
import { ZodError, z } from "zod"

import Base from "@/core/base/base.js"

abstract class BaseMiddleWare extends Base {
  protected z = z

  protected bodyHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    schema: z.ZodType,
  ): Response | void => this.validate(req.body, res, next, schema)

  protected paramHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    schema: z.ZodType,
  ): Response | void => this.validate(req.params, res, next, schema)

  protected queryHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
    schema: z.ZodType,
  ): Response | void => this.validate(req.query, res, next, schema)

  private validate = (
    input: unknown,
    res: Response,
    next: NextFunction,
    schema: z.ZodType,
  ): Response | void => {
    const result = schema.safeParse(input)

    return result.success ? next() : this.zodError(res, result.error)
  }

  public zodError = (res: Response, error: ZodError): Response =>
    this.respond(res, "BAD_REQUEST", {
      message: error.issues[0].message,
    })

  protected abstract middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void | Promise<void>

  public async run(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await this.middleware(req, res, next)
    } catch (error) {
      req.log.error({ err: error }, "Middleware error")

      if (!res.headersSent) {
        this.respond(res, "SERVER_ERROR")
      }
    }
  }
}

export default BaseMiddleWare
