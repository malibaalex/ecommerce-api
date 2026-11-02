import UserAuthenticate from "./authenticate.js"
import CheckEmailExists from "./check-email-exists.js"

const User = new UserAuthenticate()
const CheckEmail = new CheckEmailExists()

const Authenticate = {
  User,
  CheckEmail,
}

export default Authenticate
