import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class VerifyEmailValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      sessionId: this.z.string().uuid("Invalid session ID format"),
      code: this.z.string().length(6, "Verification code must be 6 digits"),
      password: this.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .optional(),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default VerifyEmailValidator
