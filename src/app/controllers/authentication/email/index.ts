import SignInWithEmailController from "./email-sign-in.js"
import VerifyEmailController from "./email-verify.js"

const SignIn = new SignInWithEmailController()
const Verify = new VerifyEmailController()

const Email = {
  SignIn,
  Verify,
}

export default Email
