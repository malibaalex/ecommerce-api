import CreateOtpCodeService from "./otp-code-create.js"
import VerifyOtpCodeService from "./otp-code-verify.js"

const Create = new CreateOtpCodeService()
const Verify = new VerifyOtpCodeService()

const OtpCode = {
  Create,
  Verify,
}

export default OtpCode
