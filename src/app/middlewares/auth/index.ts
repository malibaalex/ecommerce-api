import UserAuthentication from "./authentication.js"
import CheckEmailExists from "./check-email-exists.js"

const User = new UserAuthentication()
const CheckEmail = new CheckEmailExists()

const Auth = {
  User,
  CheckEmail,
}

export default Auth
