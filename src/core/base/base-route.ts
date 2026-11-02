import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express"
import { IController, IMiddleware, IRoute } from "@/types/app.js"

interface RouteConfig {
  method: "get" | "post" | "put" | "patch" | "delete"
  route: string
  middlewares?: IMiddleware[]
  controller: IController
}

class BaseRoute implements IRoute {
  public readonly router = Router()

  constructor(
    public readonly path: string,
    config: RouteConfig,
  ) {
    const handlers: RequestHandler[] = [
      ...(config.middlewares ?? []).map(
        (m): RequestHandler =>
          (req: Request, res: Response, next: NextFunction) =>
            m.run(req, res, next),
      ),
      (req: Request, res: Response) => config.controller.execute(req, res),
    ]

    this.router[config.method](`${path}${config.route}`, ...handlers)
  }
}

export default BaseRoute
