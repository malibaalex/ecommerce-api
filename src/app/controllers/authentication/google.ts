import type { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"
import googleStrategy, {
  type GoogleAuthErrorCode,
} from "@/core/base/google/google-strategy.js"

type LoginErrorCode = GoogleAuthErrorCode | "account_suspended" | "server_error"

class GoogleAuthCallbackController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const fail = (code: LoginErrorCode) => {
      this.Utils.OauthCookie.clearCookie(req)
      return res.redirect(`/login?error=${code}`)
    }

    try {
      const result = await googleStrategy.authenticate(req, res)
      if (!result.ok) return fail(result.code)

      const user =
        await this.Services.Authenticate.GoogleAccount.UpsertUser.call(
          result.identity,
        )
      if (!user || user.status === "suspended") {
        return fail("account_suspended")
      }

      const accessToken = this.Utils.Token.signAccess({ payload: user })
      const refreshTokenRaw = this.Utils.Token.signRefresh({
        userId: user.id,
      })

      await this.Services.Authenticate.RefreshToken.Save.call({
        token: refreshTokenRaw,
        userId: user.id,
      })

      this.Utils.OauthCookie.clearCookie(req)
      this.Utils.Cookie.setAccessCookie(res, accessToken)
      this.Utils.Cookie.setRefreshCookie(res, refreshTokenRaw)

      return res.redirect("/dashboard")
    } catch {
      return fail("server_error")
    }
  }
}

export default GoogleAuthCallbackController
