import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"

class SignInController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, password } = req.body

    const credentialWithUser =
      await this.Services.Authenticate.Credential.Verify.call({
        email,
        password,
      })
    if (!credentialWithUser) {
      return this.respond(res, "UNAUTHORIZED", {
        message: "Invalid email or password",
      })
    }

    const user = credentialWithUser.user
    if (user.status === "suspended") {
      return this.respond(res, "FORBIDDEN", { message: "Account is suspended" })
    }

    const userData = this.Utils.OmitProperty(user, ["status", "updatedAt"])

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

export default SignInController
