import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class IdValidator extends BaseMiddleWare {
  schema = this.z.object({
    id: this.z.uuid(),
  })

  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.paramHandler(req, res, next, this.schema)
  }
}

export default IdValidator
