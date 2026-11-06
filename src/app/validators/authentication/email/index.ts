import PasswordSignInValidator from "./email-password-sign-in.js.js"
import SignInWithEmailValidator from "./email-sign-in.js"

const SignIn = new SignInWithEmailValidator()
const PasswordSignIn = new PasswordSignInValidator()

const Email = {
  SignIn,
  PasswordSignIn,
}

export default Email
