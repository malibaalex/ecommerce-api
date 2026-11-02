import CreateOtpCodeService from "./otp-code-create.js"
import VerifyOtpCodeService from "./otp-code-verify.js"

const CreateOtpCode = new CreateOtpCodeService()
const VerifyOtpCode = new VerifyOtpCodeService()

const OtpCodeServices = {
  CreateOtpCode,
  VerifyOtpCode,
}

export default OtpCodeServices
