import Controllers from "@/app/controllers/index.js"
import BaseRoute from "@/core/base/base-route.js"

class LogoutRoute extends BaseRoute {
  constructor(path: string) {
    super(path, {
      method: "post",
      route: "/logout",
      rateLimit: { windowMs: 15, limit: 60 },
      controller: Controllers.Authenticate.LogOut,
    })
  }
}

export default LogoutRoute
