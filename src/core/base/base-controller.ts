import { Request, Response } from "express"

import Base from "./base.js"

abstract class BaseControlller extends Base {
  protected abstract module(
    req: Request,
    res: Response,
  ): Promise<void | Response>

  public async execute(req: Request, res: Response): Promise<void> {
    try {
      await this.module(req, res)
    } catch (error) {
      req.log.error({ err: error }, "Controller execution error")
      this.respond(res, "SERVER_ERROR")
    }
  }
}

export default BaseControlller
