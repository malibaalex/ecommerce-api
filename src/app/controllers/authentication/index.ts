import Email from "./email/index.js"
import Google from "./google/index.js"
import LogOutController from "./logout.js"
import Otp from "./otp/index.js"
import RefreshController from "./refresh.js"
import ResetPasswordController from "./reset-password.js"

const LogOut = new LogOutController()
const Refresh = new RefreshController()
const ResetPassword = new ResetPasswordController()

const Authenticate = {
  Google,
  Email,
  LogOut,
  Refresh,
  ResetPassword,
  Otp,
}

export default Authenticate
