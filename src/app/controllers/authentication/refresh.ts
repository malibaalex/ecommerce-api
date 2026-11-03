import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"

class RefreshController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const oldToken = this.Utils.Token.extractRefresh(req)
    if (!oldToken) {
      return this.respond(res, "UNAUTHORIZED", {
        message: "Refresh token is missing",
      })
    }

    const rotated = await this.Services.Authenticate.RefreshToken.Rotate.call({
      oldToken,
    })
    if (!rotated) {
      this.Utils.Cookie.clearAuthCookies(res)
      return this.respond(res, "UNAUTHORIZED", {
        message: "Invalid or expired refresh token",
      })
    }

    const user = rotated.user
    const userData = this.Utils.OmitProperty(user, ["status", "updatedAt"])

    const accessToken = this.Utils.Token.signAccess({ payload: user })

    this.Utils.Cookie.setAccessCookie(res, accessToken)
    this.Utils.Cookie.setRefreshCookie(res, rotated.token)

    return this.respond(res, "SUCCESS", {
      message: "Token refreshed successfully",
      data: { user: userData },
    })
  }
}

export default RefreshController
