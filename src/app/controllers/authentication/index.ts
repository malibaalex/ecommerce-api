import GoogleAuthCallbackController from "./google.js"
import Otp from "./otp/index.js"
import ResetPasswordController from "./reset-password.js"
import SignInController from "./sign-in-user.js"
import SignUpController from "./sign-up-user.js"

const Google = new GoogleAuthCallbackController()
const SignUp = new SignUpController()
const SignIn = new SignInController()
const ResetPassword = new ResetPasswordController()

const Authenticate = {
  Google,
  SignUp,
  SignIn,
  ResetPassword,
  Otp,
}

export default Authenticate
