import SendOtpController from "./send-otp.js"
import VerifyOtpController from "./verify-otp.js"

const Send = new SendOtpController()
const Verify = new VerifyOtpController()

const Otp = {
  Send,
  Verify,
}

export default Otp
