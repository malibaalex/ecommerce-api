import Google from "./google/index.js"
import LogOutRoute from "./logout.js"
import Otp from "./otp/index.js"
import RefreshTokenRoute from "./refresh.js"
import SignInRoute from "./sign-in.js"
import SignUpRoute from "./sign-up.js"

const PATH = "/auth/"

const SignUp = new SignUpRoute(PATH)
const SignIn = new SignInRoute(PATH)
const LogOut = new LogOutRoute(PATH)
const Refresh = new RefreshTokenRoute(PATH)

const AuthRoutes = {
  GoogleStart: Google.Start,
  GoogleCallBack: Google.CallBack,
  SignUp,
  SignIn,
  LogOut,
  Refresh,
  OtpSend: Otp.Send,
  OptVerify: Otp.Verify,
}

export default AuthRoutes
