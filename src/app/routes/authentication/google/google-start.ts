import BaseRoute from "@/core/base/base-route.js"
import Controllers from "@/app/controllers/index.js"

class GoogleStartRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "get",
      route: "/start",
      rateLimit: { windowMs: 15, limit: 10 },
      controller: Controllers.Authenticate.Google.Start,
    })
  }
}
export default GoogleStartRoute
