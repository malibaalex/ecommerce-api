import { NextFunction, Request, Response } from "express"
import BaseMiddleWare from "@/core/base/base-middleware.js"

class UserAuthenticate extends BaseMiddleWare {
  protected async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const extracted = this.Utils.Token.extractAccess(req)

    if (!extracted) {
      this.respond(res, "UNAUTHORIZED", { message: "Authentication required" })
      return
    }

    const payload = this.Utils.Token.verifyAccess(extracted.token)
    if (!payload) {
      this.respond(res, "UNAUTHORIZED", {
        message: "Invalid or expired access token",
      })
      return
    }

    const user = await this.Services.User.GetById.call(payload.payload.id)
    if (!user) {
      this.respond(res, "UNAUTHORIZED", {
        message: "User not found or inactive",
      })
      return
    }

    req.currentUser = user
    next()
  }
}

export default UserAuthenticate
