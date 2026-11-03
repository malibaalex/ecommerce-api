import { Request, Response } from "express"
import BaseControlller from "@/core/base/base-controller.js"

class SignUpController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const { email, name, password } = req.body

    const existingUser = await this.Services.User.GetByEmail.call(email)
    if (existingUser) {
      return this.respond(res, "CONFLICT", { message: "Email already in use" })
    }

    const user = await this.Services.User.Create.call({
      email,
      name,
      password,
    })
    if (!user) {
      return this.respond(res, "SERVER_ERROR", {
        message: "Failed to create user account",
      })
    }

    const userData = this.Utils.OmitProperty(user, ["status", "updatedAt"])

    return this.respond(res, "CREATED", {
      message: "User registered successfully",
      data: { user: userData },
    })
  }
}

export default SignUpController
