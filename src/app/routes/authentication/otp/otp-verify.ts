import BaseRoute from "@/core/base/base-route.js"
import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"

class VerifyOtpRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/verify",
      rateLimit: {
        windowMs: 15 * 60 * 1000,
        limit: 5, // Strict limit to prevent brute-forcing verification codes
        message:
          "Too many verification attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.Otp.Verify],
      controller: Controllers.Authenticate.Otp.Verify,
    })
  }
}

export default VerifyOtpRoute
