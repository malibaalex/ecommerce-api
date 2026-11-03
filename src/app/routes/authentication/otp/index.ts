import SendOtpRoute from "./otp-send.js"
import VerifyOtpRoute from "./otp-verify.js"

const PATH = "/auth/"

const Send = new SendOtpRoute(PATH)
const Verify = new VerifyOtpRoute(PATH)

const Otp = {
  Send,
  Verify,
}

export default Otp
