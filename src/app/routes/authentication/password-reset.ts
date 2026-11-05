import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"
import BaseRoute from "@/core/base/base-route.js"

class ResetPasswordRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/password-reset",
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes (in milliseconds)
        limit: 5, // Stricter limit to prevent brute-forcing password resets
        message:
          "Too many password reset attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.ResetPassword],
      controller: Controllers.Authenticate.ResetPassword,
    })
  }
}

export default ResetPasswordRoute
