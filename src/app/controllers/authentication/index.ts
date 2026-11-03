import Google from "./google/index.js"
import LogOutController from "./logout.js"
import Otp from "./otp/index.js"
import RefreshController from "./refresh.js"
import ResetPasswordController from "./reset-password.js"
import SignInController from "./sign-in.js"
import SignUpController from "./sign-up.js"

const SignUp = new SignUpController()
const SignIn = new SignInController()
const LogOut = new LogOutController()
const Refresh = new RefreshController()
const ResetPassword = new ResetPasswordController()

const Authenticate = {
  SignUp,
  SignIn,
  LogOut,
  Refresh,
  ResetPassword,
  Otp,
  Google,
}

export default Authenticate
