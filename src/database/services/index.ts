import UserServices from "./user/index.js"
import OAuthTransactionServices from "./oauth-transaction/index.js"
import RefreshTokenServices from "./refresh-token/index.js"
import CredentialServices from "./credential/index.js"
import GoogleAccountServices from "./google-account/index.js"
import OtpCodeServices from "./otp-code/index.js"

const Services = {
  // authentication
  UserServices,
  OAuthTransactionServices,
  RefreshTokenServices,
  CredentialServices,
  GoogleAccountServices,
  OtpCodeServices,

  // authorization soon
}

export default Services
