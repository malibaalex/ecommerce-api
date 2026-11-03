import { IRoute } from "@/types/app.js"
import AuthRoutes from "./authentication/index.js"

const routes: IRoute[] = Object.values(AuthRoutes)

export default routes
