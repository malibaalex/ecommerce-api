import SignInWithEmailValidator from "./email-sign-in.js"
import VerifyEmailValidator from "./email-verify.js"

const SignIn = new SignInWithEmailValidator()
const Verify = new VerifyEmailValidator()

const Email = {
  SignIn,
  Verify,
}

export default Email
