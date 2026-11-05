import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class SendOtpValidator extends BaseMiddleWare {
  schema = this.z.object({
    email: this.z
      .email("Invalid email format")
      .transform((val) => val.toLowerCase().trim()),
    purpose: this.z.enum(["email_verification", "password_reset"]),
  })

  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.bodyHandler(req, res, next, this.schema)
  }
}

export default SendOtpValidator
