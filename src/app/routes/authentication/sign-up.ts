import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"
import BaseRoute from "@/core/base/base-route.js"

class SignUpRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "sign-up",
      rateLimit: {
        windowMs: 15,
        limit: 10,
        message: "Too many signup attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.SignUp],
      controller: Controllers.Authenticate.SignUp,
    })
  }
}

export default SignUpRoute
