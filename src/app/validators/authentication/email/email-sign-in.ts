import BaseMiddleWare from "@/core/base/base-middleware.js"
import { Request, Response, NextFunction } from "express"
import { z } from "zod"

class SignInWithEmailValidator extends BaseMiddleWare {
  schema = z.object({
    email: z
      .email("Invalid email format")
      .transform((val) => val.toLowerCase().trim()),
    password: z.string().min(1, "Password is required"),
    provider: this.z.enum(["google"]).optional(),
  })

  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    this.bodyHandler(req, res, next, this.schema)
  }
}

export default SignInWithEmailValidator
