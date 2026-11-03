import BaseControlller from "@/core/base/base-controller.js"
import { Request, Response } from "express"

class LogOutController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const token = this.Utils.Token.extractRefresh(req)

    if (token) {
      this.Services.Authenticate.RefreshToken.Revoke.call(token)
    }

    this.Utils.Cookie.clearAuthCookies(res)

    return this.respond(res, "SUCCESS", {
      message: "Signed out successfully",
    })
  }
}

export default LogOutController
