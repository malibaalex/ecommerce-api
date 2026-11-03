import BaseRoute from "@/core/base/base-route.js"
import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"

class ResetPasswordRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/reset-password",
      rateLimit: {
        windowMs: 15,
        limit: 10,
        message: "Too many password reset requests. Please check back later.",
      },
      validators: [Validators.Authenticate.ResetPassword],
      controller: Controllers.Authenticate.ResetPassword,
    })
  }
}

export default ResetPasswordRoute
