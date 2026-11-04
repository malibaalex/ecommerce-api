import Email from "./email/index.js"
import Google from "./google/index.js"
import LogOutRoute from "./logout.js"
import Otp from "./otp/index.js"
import RefreshTokenRoute from "./refresh.js"

const PATH = "/auth/"

const LogOut = new LogOutRoute(PATH)
const Refresh = new RefreshTokenRoute(PATH)

const AuthRoutes = {
  GoogleStart: Google.Start,
  GoogleCallBack: Google.CallBack,
  EmailSignIn: Email.SignIn,
  EmailVerify: Email.Verify,
  LogOut,
  Refresh,
  OtpSend: Otp.Send,
  OptVerify: Otp.Verify,
}

export default AuthRoutes
