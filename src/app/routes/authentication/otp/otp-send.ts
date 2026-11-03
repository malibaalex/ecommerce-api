import BaseRoute from "@/core/base/base-route.js"
import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"

class SendOtpRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/otp/send",
      rateLimit: {
        windowMs: 15 * 60 * 1000,
        limit: 5, // Strict limit for sending OTPs to prevent spam
        message: "Too many OTP requests. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.Otp.Send],
      controller: Controllers.Authenticate.Otp.Send,
    })
  }
}

export default SendOtpRoute
