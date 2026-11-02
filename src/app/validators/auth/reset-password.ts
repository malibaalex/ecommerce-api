import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class ResetPasswordValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      email: this.z
        .email("Invalid email format")
        .transform((val) => val.toLowerCase().trim()),
      code: this.z.string().length(6, "OTP code must be 6 digits"),
      newPassword: this.z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(100),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default ResetPasswordValidator
