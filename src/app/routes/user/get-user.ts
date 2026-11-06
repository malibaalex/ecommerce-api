import Controllers from "@/app/controllers/index.js"
import MiddleWares from "@/app/middlewares/index.js"
import BaseRoute from "@/core/base/base-route.js"

class GetMeRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "get",
      route: "/get-me",
      rateLimit: true,
      middlewares: [MiddleWares.Authenticate.User],
      controller: Controllers.User.GetMe,
    })
  }
}

export default GetMeRoute
