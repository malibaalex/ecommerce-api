import SignupUserValidator from "./sign-up-user.js"
import SignInUserValidator from "./sign-in-user.js"
import VerifyOtpValidator from "./verify-otp.js"
import ResetPasswordValidator from "./reset-password.js"

const SignupUser = new SignupUserValidator()
const SignInUser = new SignInUserValidator()
const VerifyOtp = new VerifyOtpValidator()
const ResetPassword = new ResetPasswordValidator()

const Authenticate = {
  SignupUser,
  SignInUser,
  VerifyOtp,
  ResetPassword,
}

export default Authenticate
