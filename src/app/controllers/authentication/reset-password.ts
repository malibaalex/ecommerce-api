import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"
import { ValidatorTypes } from "@/app/validators/index.js"

class ResetPasswordController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { sessionId, code, newPassword } =
      req.body as ValidatorTypes["Authenticate"]["Password"]

    // Verify session and OTP validity via authentication session verify service
    const user = await this.Services.Authenticate.SignInSession.Verify.call({
      sessionId,
      code,
    })

    if (!user) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired code",
      })
    }

    // Overwrite or update password for password reset flow
    const updated = await this.Services.Authenticate.Password.Set.call({
      userId: user.id,
      password: newPassword,
    })

    if (!updated) {
      return this.respond(res, "SERVER_ERROR", {
        message: "Unable to reset password",
      })
    }

    return this.respond(res, "SUCCESS", {
      message: "Password updated successfully. Please sign in.",
    })
  }
}

export default ResetPasswordController
