import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"

class VerifyOtpController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, code, purpose } = req.body

    const user = await this.Services.User.GetUserByEmail.call(email)
    if (!user) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired OTP code",
      })
    }

    const verifiedOtp =
      await this.Services.Authenticate.OtpCode.VerifyOtpCode.call({
        userId: user.id,
        purpose,
        code,
      })

    if (!verifiedOtp) {
      return this.respond(res, "BAD_REQUEST", {
        message: "Invalid or expired OTP code",
      })
    }

    if (purpose === "email_verification") {
      await this.Services.User.UpdateUser.call({
        userId: user.id,
        emailVerified: true,
      })
      return this.respond(res, "SUCCESS", {
        message: "Email verified successfully",
      })
    }

    return this.respond(res, "SUCCESS", {
      message: "OTP verified successfully",
    })
  }
}

export default VerifyOtpController
