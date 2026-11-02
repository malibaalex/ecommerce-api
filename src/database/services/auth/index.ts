import User from "./user/index.js"
import OAuthTransaction from "./oauth-transaction/index.js"
import RefreshToken from "./refresh-token/index.js"
import Credential from "./credential/index.js"
import GoogleAccount from "./google-account/index.js"
import OtpCode from "./otp-code/index.js"

const Auth = {
  User,
  OAuthTransaction,
  RefreshToken,
  Credential,
  GoogleAccount,
  OtpCode,
}

export default Auth
