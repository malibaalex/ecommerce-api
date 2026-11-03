import { Request, RequestHandler, Response, Router } from "express"
import Base from "@/core/base/base.js"
import RateLimit from "./rate-limit/index.js"
import {
  HttpMethod,
  IController,
  IMiddleware,
  IRoute,
  IValidator,
} from "@/types/app.js"

// Infer options type from RateLimit.create
type RateLimitOptions = Parameters<typeof RateLimit.create>[0]

interface RouteConfig {
  method: HttpMethod
  route: string
  rateLimit?: RateLimitOptions | boolean // Pass options or true for defaults
  validators?: IValidator[]
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

    const toHandler =
      (m: IMiddleware | IValidator): RequestHandler =>
      (req, res, next) =>
        m.run(req, res, next)

    // Automatically instantiate the rate limiter inside BaseRoute
    let rateLimitHandler: RequestHandler | undefined
    if (config.rateLimit) {
      const options =
        typeof config.rateLimit === "object" ? config.rateLimit : {}
      rateLimitHandler = RateLimit.create(options)
    }

    // Order: rate limit -> validators -> middlewares -> controller
    const handlers: RequestHandler[] = [
      ...(rateLimitHandler ? [rateLimitHandler] : []),
      ...(config.validators ?? []).map(toHandler),
      ...(config.middlewares ?? []).map(toHandler),

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
