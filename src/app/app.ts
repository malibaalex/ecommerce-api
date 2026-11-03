/* eslint-disable @typescript-eslint/no-unused-vars */
import express, {
  Response,
  Request,
  NextFunction,
  Application,
  Router,
} from "express"
import cookieParser from "cookie-parser"
import * as pinoHttp from "pino-http"

import Base from "@/core/base/base.js"
import logger from "@/core/utils/logger.js"
import { IRoute } from "@/types/app.js"
import ErrorHandler from "./middlewares/error-handler.js"
import path from "path"

type RouteInput = IRoute | Router | { router: Router } | Record<string, unknown>

class App extends Base {
  private app: Application
  private errorHandler = new ErrorHandler()

  constructor(routes: RouteInput[]) {
    super()
    this.app = express()
    this.initMiddlewares()
    this.initRoutes(routes)
    this.initDefaultRoute()
    this.initErrorHandler() // must be registered last
  }

  private initMiddlewares(): void {
    this.app.use(express.static(path.join(process.cwd(), "public")))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieParser())

    // Type-safe handling of pino-http interop default/namespace export
    const httpLogger =
      typeof pinoHttp === "function"
        ? pinoHttp
        : ((pinoHttp as unknown as { default?: typeof pinoHttp }).default ??
          pinoHttp)

    // @ts-expect-error pinoHttp types match configuration object requirements
    this.app.use(httpLogger({ logger }))
  }

  private initRoutes(routes: RouteInput[]): void {
    const registerRouter = (item: unknown): void => {
      if (!item) return

      if (typeof item === "function" && "handle" in item) {
        this.app.use("/api", item as unknown as Router)
      } else if (typeof item === "object" && item !== null) {
        if ("router" in item && item.router) {
          registerRouter(item.router)
        } else if (Array.isArray(item)) {
          item.forEach(registerRouter)
        } else {
          Object.values(item as Record<string, unknown>).forEach(registerRouter)
        }
      }
    }

    routes.forEach(registerRouter)
  }

  private initDefaultRoute(): void {
    this.app.get("/", (req: Request, res: Response) => {
      return this.welcome(req, res)
    })

    this.app.all("/", (_req: Request, res: Response) => {
      return this.respond(res, "METHOD_NOT_ALLOWED")
    })

    this.app.use("*splat", (_req: Request, res: Response) => {
      return this.respond(res, "NOT_FOUND")
    })
  }

  private initErrorHandler(): void {
    this.app.use(this.errorHandler.handle)
  }

  public listen(): void {
    this.app.listen(this.Utils.port, () => {
      this.listening(this.Utils.port)
    })
  }

  public get instance(): Application {
    return this.app
  }
}

export default App
