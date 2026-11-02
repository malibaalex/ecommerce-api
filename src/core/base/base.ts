import { Request, Response } from "express"
import Services from "@/database/services/index.js"
import { HTTP_MSG, HTTP_STATUS, ResponseKey } from "../utils/constants.js"
import { Utils } from "../utils/index.js"
import logger from "../utils/logger.js"

class Base {
  protected readonly Utils = Utils
  protected readonly Service = Services

  protected respond(
    res: Response,
    key: ResponseKey,
    options: { message?: string; data?: unknown } = {},
  ): Response {
    const status = HTTP_STATUS[key]
    return res.status(status).json({
      status,
      message: options.message ?? HTTP_MSG[key],
      timestamp: new Date().toISOString(),
      requestId: res.getHeader("x-request-id"),
      data: options.data,
    })
  }

  protected listening(port: number | boolean): string {
    const message = `App listening on port ${port}`
    if (this.Utils.env.NODE_ENV === "development") {
      logger.info(message)
    }
    return message
  }

  protected welcome(_req: Request, res: Response): Response {
    return this.respond(res, "SUCCESS", {
      message: HTTP_MSG.WELCOME,
      data: { port: this.Utils.port },
    })
  }
}

export default Base
