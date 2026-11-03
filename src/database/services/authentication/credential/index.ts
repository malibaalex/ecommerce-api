import ResetCredentialService from "./credential-reset.js"
import VerifyCredentialService from "./credential-verify.js"

const Verify = new VerifyCredentialService()
const Reset = new ResetCredentialService()

const Credential = {
  Verify,
  Reset,
}

export default Credential
