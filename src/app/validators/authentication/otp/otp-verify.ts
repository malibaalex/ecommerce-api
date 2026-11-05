import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class VerifyOtpValidator extends BaseMiddleWare {
  schema = this.z.object({
    sessionId: this.z.string().uuid("Invalid session ID format"),
    code: this.z.string().length(6, "OTP code must be 6 digits"),
    password: this.z.string().min(1, "Password is required").optional(),
  })

  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.bodyHandler(req, res, next, this.schema)
  }
}

export default VerifyOtpValidator
