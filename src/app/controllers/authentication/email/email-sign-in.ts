import { Request, Response } from "express"
import crypto from "node:crypto"
import BaseControlller from "@/core/base/base-controller.js"
import mailer from "@/core/utils/mailer.js"

const OTP_TTL_MS = 10 * 60 * 1000

class SignInWithEmailController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, provider, password } = req.body as {
      email: string
      provider?: "google"
      password?: string
    }

    if (provider) {
      const redirectUrl =
        provider === "google" ? this.Utils.env.GOOGLE_START_PATH : null

      if (!redirectUrl) {
        return this.respond(res, "BAD_REQUEST", {
          message: "Unsupported provider",
        })
      }

      return this.respond(res, "SUCCESS", {
        message: "Continue with provider",
        data: { action: "redirect", url: redirectUrl },
      })
    }

    return this.credentialFlow(res, email, password as string)
  }

  private challenge(res: Response, sessionId: string) {
    return this.respond(res, "SUCCESS", {
      message:
        "If the details are correct, a verification code has been sent to your email.",
      data: { action: "verify_otp", sessionId },
    })
  }

  private async credentialFlow(res: Response, email: string, password: string) {
    const decoy = () => this.challenge(res, crypto.randomUUID())

    let userId: string

    const verifiedUser = await this.Services.Authenticate.Password.Verify.call({
      email,
      password,
    })

    if (verifiedUser) {
      if (verifiedUser.status !== "active") return decoy()
      userId = verifiedUser.id
    } else {
      const state = await this.Services.User.GetAuthState.call(email)

      if (state?.hasPassword || state?.status === "suspended") return decoy()

      const target =
        state ?? (await this.Services.User.ProvisionPending.call(email))
      if (!target) {
        return this.respond(res, "SERVER_ERROR", {
          message: "Unable to start sign-in",
        })
      }
      userId = target.id
    }

    const code = crypto.randomInt(100000, 1000000).toString()

    const session = await this.Services.Authenticate.SignInSession.Create.call({
      userId,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
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
      .sendOtpEmail(email, code, "verification")
      .catch((err) => console.error("[otp] email failed:", err))

    return this.challenge(res, session.sessionId)
  }
}

export default SignInWithEmailController
