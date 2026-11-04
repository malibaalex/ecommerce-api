import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class VerifyEmailValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      email: this.z
        .email("Invalid email format")
        .transform((val) => val.toLowerCase().trim()),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default VerifyEmailValidator
