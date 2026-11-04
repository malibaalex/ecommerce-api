import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"
import BaseRoute from "@/core/base/base-route.js"

class SignInWithEmailRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/sign-in",
      rateLimit: {
        windowMs: 15,
        limit: 10,
        message: "Too many signin attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.Email.SignIn],
      controller: Controllers.Authenticate.Email.SignIn,
    })
  }
}

export default SignInWithEmailRoute
