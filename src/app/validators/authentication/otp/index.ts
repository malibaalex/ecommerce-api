import SendOtpValidator from "./otp-send.js"
import VerifyOtpValidator from "./otp-verify.js"

const Verify = new VerifyOtpValidator()
const Send = new SendOtpValidator()

const Otp = {
  Verify,
  Send,
}

export default Otp
