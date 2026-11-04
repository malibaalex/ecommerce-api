import SignInWithEmailRoute from "./email-sign-in.js"
import VerifyEmailRoute from "./email-verify.js"

const PATH = "/auth/email"

const SignIn = new SignInWithEmailRoute(PATH)
const Verify = new VerifyEmailRoute(PATH)

const Email = {
  SignIn,
  Verify,
}

export default Email
