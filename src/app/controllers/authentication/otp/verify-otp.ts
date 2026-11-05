import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"
import { ValidatorTypes } from "@/app/validators/index.js"

class VerifyOtpController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { sessionId, code, password } =
      req.body as ValidatorTypes["Authenticate"]["Otp"]["Verify"]

    const user = await this.Services.Authenticate.SignInSession.Verify.call({
      sessionId,
      code,
    })

    if (!user) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired code",
      })
    }

    if (password) {
      const set = await this.Services.Authenticate.Password.Set.call({
        userId: user.id,
        password,
      })
      if (!set) {
        return this.respond(res, "SERVER_ERROR", {
          message: "Unable to complete sign-in",
        })
      }
    }

    const userData = this.Utils.OmitProperty(user, [
      "status",
      "updatedAt",
      "passwordHash",
    ])

    const accessToken = this.Utils.Token.signAccess({ payload: user })
    const refreshTokenRaw = this.Utils.Token.signRefresh({ userId: user.id })

    await this.Services.Authenticate.RefreshToken.Save.call({
      token: refreshTokenRaw,
      userId: user.id,
    })

    this.Utils.Cookie.setAccessCookie(res, accessToken)
    this.Utils.Cookie.setRefreshCookie(res, refreshTokenRaw)

    return this.respond(res, "SUCCESS", {
      message: "Signed in successfully",
      data: { user: userData },
    })
  }
}

export default VerifyOtpController
