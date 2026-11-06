import { Request, Response } from "express"
import BaseController from "@/core/base/base-controller.js"
import { ValidatorTypes } from "@/app/validators/index.js"

class PasswordSignInController extends BaseController {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, password } =
      req.body as ValidatorTypes["Authenticate"]["Email"]["PasswordSignIn"]

    let user = await this.Services.User.GetAuthState.call(email)

    if (!user) {
      user = await this.Services.User.ProvisionPending.call(email)
    }

    if (!user) {
      return this.respond(res, "SERVER_ERROR", {
        message: "Unable to process sign-in",
      })
    }

    if (user.status !== "active") {
      return this.respond(res, "UNAUTHORIZED", {
        message: "Invalid email or password",
      })
    }

    if (user.hasPassword) {
      const verified = await this.Services.Authenticate.Password.Verify.call({
        email,
        password,
      })

      if (!verified) {
        return this.respond(res, "UNAUTHORIZED", {
          message: "Invalid email or password",
        })
      }
    }

    return this.respond(res, "SUCCESS", {
      message: "Continue with email verification",
      data: {
        action: "verify_otp",
        email: user.email,
        requiresPasswordSetup: !user.hasPassword,
      },
    })
  }
}

export default PasswordSignInController
