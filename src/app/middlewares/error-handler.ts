/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Request, Response, NextFunction } from "express"
import Base from "@/core/base/base.js"

class ErrorHandler extends Base {
  public handle = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    if (res.headersSent) return

    const status = (err as { status?: number }).status
    if (status === 400) {
      this.respond(res, "BAD_REQUEST", {
        message: err.message || "Invalid request",
      })
    }

    this.respond(res, "SERVER_ERROR", {
      message: "Internal Server Error",
    })
  }
}

export default ErrorHandler
