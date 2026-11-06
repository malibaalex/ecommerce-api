import z from "zod"
import IdValidator from "@/app/validators/validator-id.js"
import Authenticate from "./authentication/index.js"

const Id = new IdValidator()

const Validators = { Id, Authenticate }

export type ValidatorTypes = {
  Id: z.infer<typeof Id.schema>
  Authenticate: {
    Email: {
      SignIn: z.infer<typeof Authenticate.Email.SignIn.schema>
      PasswordSignIn: z.infer<typeof Authenticate.Email.PasswordSignIn.schema>
    }
    Otp: {
      Send: z.infer<typeof Authenticate.Otp.Send.schema>
      Verify: z.infer<typeof Authenticate.Otp.Verify.schema>
    }
    Password: z.infer<typeof Authenticate.ResetPassword.schema>
  }
}

export default Validators
