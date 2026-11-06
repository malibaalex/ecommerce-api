import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class PasswordSignInValidator extends BaseMiddleWare {
  schema = this.z.object({
    email: this.z
      .email("Invalid email format")
      .transform((value) => value.toLowerCase().trim()),

    password: this.z.string().min(8, "Password must be at least 8 characters"),
  })

  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.bodyHandler(req, res, next, this.schema)
  }
}

export default PasswordSignInValidator
