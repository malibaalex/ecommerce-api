import SignupValidator from "./sign-up.js"
import SignInValidator from "./sign-in.js"
import ResetPasswordValidator from "./reset-password.js"
import Otp from "./otp/index.js"

const SignUp = new SignupValidator()
const SignIn = new SignInValidator()
const ResetPassword = new ResetPasswordValidator()

const Authenticate = {
  SignUp,
  SignIn,
  Otp,
  ResetPassword,
}

export default Authenticate
