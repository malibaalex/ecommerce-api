import BaseRoute from "@/core/base/base-route.js"
import Controllers from "@/app/controllers/index.js"

class GoogleCallbackRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "get",
      route: "/google/callback",
      rateLimit: { windowMs: 15, limit: 10 },
      controller: Controllers.Authenticate.Google.CallBack,
    })
  }
}

export default GoogleCallbackRoute
