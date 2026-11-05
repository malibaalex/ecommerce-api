import BaseControlller from "@/core/base/base-controller.js"
import { User } from "@/generated/prisma/client.js"
import { Request, Response } from "express"

class GetMeController extends BaseControlller {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    const user = req.currentUser

    if (!user) {
      return this.respond(res, "UNAUTHORIZED", {
        message: "Authentication required. Please log in again.",
      })
    }

    const userData = this.Utils.OmitProperty(user as User, [
      "passwordHash",
      "updatedAt",
      "status",
    ])

    return this.respond(res, "SUCCESS", {
      message: "User profile retrieved successfully.",
      data: { user: userData },
    })
  }
}

export default GetMeController
