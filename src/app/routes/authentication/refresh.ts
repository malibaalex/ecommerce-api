import Controllers from "@/app/controllers/index.js"
import BaseRoute from "@/core/base/base-route.js"

class RefreshTokenRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "get",
      route: "/refresh",
      rateLimit: true, // Uses default limit, windowMs, and default error message
      controller: Controllers.Authenticate.Refresh,
    })
  }
}

export default RefreshTokenRoute
