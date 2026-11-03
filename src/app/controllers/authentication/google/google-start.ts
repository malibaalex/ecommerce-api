import type { Request, Response } from "express"
import BaseController from "@/core/base/base-controller.js"
import googleStrategy from "@/core/base/google/google-strategy.js"

class GoogleStartController extends BaseController {
  protected async module(
    req: Request,
    res: Response,
  ): Promise<void | Response> {
    return new Promise((resolve, reject) => {
      // Pass a custom next function to handle errors or completion
      googleStrategy.redirect(req, res, (err?: unknown) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

export default GoogleStartController
