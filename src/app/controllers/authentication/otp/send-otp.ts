import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"
import crypto from "crypto"

class SendOtpController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, purpose } = req.body

    const user = await this.Services.User.GetByEmail.call(email)
    if (!user) {
      return this.respond(res, "SUCCESS", {
        message: "If the email exists, an OTP has been sent.",
      })
    }

    const rawCode = crypto.randomInt(100000, 1000000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    const otpRecord = await this.Services.Authenticate.OtpCode.Create.call({
      userId: user.id,
      purpose,
      code: rawCode,
      expiresAt,
    })

    if (!otpRecord) {
      return this.respond(res, "SERVER_ERROR", {
        message: "Failed to generate OTP code",
      })
    }

    if (this.Utils.env.NODE_ENV === "development") {
      console.log(`\n [DEV OTP CODE for ${email}]: ${rawCode}\n`)
    }

    return this.respond(res, "SUCCESS", {
      message: "OTP code sent successfully",
    })
  }
}

export default SendOtpController
