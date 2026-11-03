import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"

class SignUpValidator extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const schema = this.z.object({
      email: this.z
        .string()
        .trim()
        .toLowerCase()
        .pipe(this.z.email("Invalid email format")),
      password: this.z.string().min(1, "Password is required"),
    })

    this.bodyHandler(req, res, next, schema)
  }
}

export default SignUpValidator
