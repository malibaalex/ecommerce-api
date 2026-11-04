import CreateSignInSessionService from "./create.js"
import VerifySignInSessionService from "./sign-in-session-verify.js"

const Create = new CreateSignInSessionService()
const Verify = new VerifySignInSessionService()

const SignInSession = {
  Create,
  Verify,
}

export default SignInSession
