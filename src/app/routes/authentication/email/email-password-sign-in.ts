import Controllers from "@/app/controllers/index.js"
import Validators from "@/app/validators/index.js"
import BaseRoute from "@/core/base/base-route.js"

class SignInWithEmailAndPassword extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/password",
      rateLimit: {
        windowMs: 15,
        limit: 10,
        message: "Too many attempts. Please try again in 15 minutes.",
      },
      validators: [Validators.Authenticate.Email.PasswordSignIn],
      controller: Controllers.Authenticate.Email.SignInWithPassWord,
    })
  }
}

export default SignInWithEmailAndPassword
