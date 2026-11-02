import { Request, RequestHandler, Response, Router } from "express"

import Base from "@/core/base/base.js"
import { IController, IMiddleware, IRoute } from "@/types/app.js"

interface RouteConfig {
  method: "get" | "post" | "put" | "patch" | "delete"
  route: string
  rateLimit?: RequestHandler
  middlewares?: IMiddleware[]
  controller: IController
}

class BaseRoute extends Base implements IRoute {
  public readonly router = Router()

  constructor(
    public readonly path: string,
    config: RouteConfig,
  ) {
    super()

    const handlers: RequestHandler[] = [
      ...(config.rateLimit ? [config.rateLimit] : []),

      ...(config.middlewares ?? []).map(
        (m): RequestHandler =>
          (req, res, next) =>
            m.run(req, res, next),
      ),

      async (req: Request, res: Response): Promise<void> => {
        try {
          await config.controller.execute(req, res)
        } catch (error) {
          req.log.error({ err: error }, "Controller error")

          if (!res.headersSent) {
            this.respond(res, "SERVER_ERROR")
          }
        }
      },
    ]

    this.router[config.method](`${path}${config.route}`, ...handlers)
  }
}

export default BaseRoute
