import { Request, Response } from "express"
import crypto from "node:crypto"
import BaseControlller from "@/core/base/base-controller.js"
import mailer from "@/core/utils/mailer.js"
import { ValidatorTypes } from "@/app/validators/index.js"

const OTP_TTL_MS = 10 * 60 * 1000

class SendOtpController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email } = req.body as ValidatorTypes["Authenticate"]["Otp"]["Send"]

    const user = await this.Services.User.GetByEmail.call(email)

    // Decoy response to prevent user enumeration
    if (!user || user.status !== "active") {
      return this.respond(res, "SUCCESS", {
        message:
          "If the details are correct, a verification code has been sent to your email.",
        data: { action: "verify_otp", sessionId: crypto.randomUUID() },
      })
    }

    const code = crypto.randomInt(100000, 1000000).toString()
    const expiresAt = new Date(Date.now() + OTP_TTL_MS)

    const session = await this.Services.Authenticate.SignInSession.Create.call({
      userId: user.id,
      code,
      expiresAt,
    })

    if (!session) {
      return this.respond(res, "SERVER_ERROR", {
        message: "Unable to start sign-in",
      })
    }

    if (this.Utils.env.NODE_ENV === "development") {
      console.log(`\n[DEV OTP for ${email}]: ${code}\n`)
    }

    mailer
      .sendOtpEmail(email, code)
      .catch((err) => console.error("[otp] email failed:", err))

    return this.respond(res, "SUCCESS", {
      message:
        "If the details are correct, a verification code has been sent to your email.",
      data: { action: "verify_otp", sessionId: session.sessionId },
    })
  }
}

export default SendOtpController
