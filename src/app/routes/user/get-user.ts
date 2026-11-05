import Controllers from "@/app/controllers/index.js"
import BaseRoute from "@/core/base/base-route.js"

class GetMeRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "get",
      route: "/me",
      rateLimit: true,
      controller: Controllers.User.GetMe,
    })
  }
}

export default GetMeRoute
