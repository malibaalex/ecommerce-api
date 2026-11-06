import SignInWithEmailAndPassword from "./email-password-sign-in.js"
import SignInWithEmailRoute from "./email-sign-in.js"

const PATH = "/auth/email"

const SignIn = new SignInWithEmailRoute(PATH)
const SignInWithPassword = new SignInWithEmailAndPassword(PATH)

const Email = {
  SignIn,
  SignInWithPassword,
}

export default Email
