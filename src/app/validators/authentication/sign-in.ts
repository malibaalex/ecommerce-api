import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class SignInValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      email: this.z
        .email("Invalid email format")
        .transform((val) => val.toLowerCase().trim()),
      password: this.z.string().min(1, "Password is required"),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default SignInValidator
