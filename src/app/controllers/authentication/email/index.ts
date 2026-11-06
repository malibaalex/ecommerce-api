import PasswordSignInController from "./email-password-sign-in.js"
import SignInWithEmailController from "./email-sign-in.js"

const SignIn = new SignInWithEmailController()
const SignInWithPassWord = new PasswordSignInController()

const Email = {
  SignIn,
  SignInWithPassWord,
}

export default Email
