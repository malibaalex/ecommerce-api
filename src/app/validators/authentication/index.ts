import Email from "./email/index.js"
import Otp from "./otp/index.js"
import PasswordResetValidator from "./password-reset.js"

const ResetPassword = new PasswordResetValidator()

const Authenticate = {
  Otp,
  Email,
  ResetPassword,
}

export default Authenticate
