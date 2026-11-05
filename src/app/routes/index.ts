import { IRoute } from "@/types/app.js"
import AuthRoutes from "./authentication/index.js"
import UserRoutes from "./user/index.js"

const routes: IRoute[] = [
  ...Object.values(AuthRoutes),
  ...Object.values(UserRoutes),
]

export default routes
