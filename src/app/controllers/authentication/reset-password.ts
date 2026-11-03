import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"

class ResetPasswordController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, code, newPassword } = req.body

    const user = await this.Services.User.GetByEmail.call(email)
    if (!user) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired OTP code",
      })
    }

    const verifiedOtp = await this.Services.Authenticate.OtpCode.Verify.call({
      userId: user.id,
      purpose: "password_reset",
      code,
    })

    if (!verifiedOtp) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired OTP code",
      })
    }

    await this.Services.Authenticate.Credential.Reset.call({
      userId: user.id,
      newPassword,
    })

    return this.respond(res, "SUCCESS", {
      message: "Password updated successfully. Please sign in.",
    })
  }
}

export default ResetPasswordController
