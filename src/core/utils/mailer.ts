import { Resend } from "resend"
import { env } from "@/core/utils/env.js"

export class MailerUtil {
  private resend: Resend

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY)
  }

  public async sendOtpEmail(
    email: string,
    code: string,
    type: "verification" | "password_reset" = "verification",
  ): Promise<void> {
    const isReset = type === "password_reset"
    const subject = isReset ? "Reset Your Password" : "Your Verification Code"
    const heading = isReset ? "Password Reset Request" : "Verification Code"
    const description = isReset
      ? "Please use the verification code below to reset your password. This code is valid for 10 minutes."
      : "Please use the verification code below to complete your sign-in. This code is valid for 10 minutes."

    await this.resend.emails.send({
      from: env.EMAIL_FROM,
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h2>${heading}</h2>
          <p>${description}</p>
          <div style="background: #f4f4f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; border-radius: 6px;">
            ${code}
          </div>
          <p style="color: #71717a; font-size: 14px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })
  }
}

export default MailerUtil
