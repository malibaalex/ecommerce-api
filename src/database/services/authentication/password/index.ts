import SetPasswordService from "./password-set.js"
import VerifyPasswordService from "./password-verify.js"

const Set = new SetPasswordService()
const Verify = new VerifyPasswordService()

const Password = {
  Set,
  Verify,
}

export default Password
