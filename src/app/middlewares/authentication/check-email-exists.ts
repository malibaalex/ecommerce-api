import { NextFunction, Request, Response } from "express"
import BaseMiddleWare from "@/core/base/base-middleware.js"

class CheckEmailExists extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { email } = req.body

    const user = await this.Services.User.GetByEmail.call(email)

    if (user) {
      this.respond(res, "CONFLICT", {
        message: "Email already exists",
      })
      return
    }

    next()
  }
}

export default CheckEmailExists
