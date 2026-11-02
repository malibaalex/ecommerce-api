import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class SignupUserValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      email: this.z
        .email("Invalid email format")
        .transform((val) => val.toLowerCase().trim()),
      name: this.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(255)
        .optional(),
      password: this.z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default SignupUserValidator
