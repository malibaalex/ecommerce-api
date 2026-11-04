import OAuthTransaction from "./oauth-transaction/index.js"
import RefreshToken from "./refresh-token/index.js"
import GoogleAccount from "./google-account/index.js"
import OtpCode from "./otp-code/index.js"
import Password from "./password/index.js"
import SignInSession from "./sign-in-session/index.js"

const Authenticate = {
  OAuthTransaction,
  RefreshToken,
  GoogleAccount,
  OtpCode,
  SignInSession,
  Password,
}

export default Authenticate
