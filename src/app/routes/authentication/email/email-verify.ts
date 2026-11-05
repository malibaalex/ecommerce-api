// src/app/routes/authenticate/email/verify-email-route.ts
import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"
import BaseRoute from "@/core/base/base-route.js"

class VerifyEmailRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/verify",
      rateLimit: {
        windowMs: 15,
        limit: 10,
        message: "Too many attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.Email.Verify],
      controller: Controllers.Authenticate.Email.Verify,
    })
  }
}

export default VerifyEmailRoute
