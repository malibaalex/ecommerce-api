import GetMeRoute from "./get-user.js"

const PATH = "/user"

const GetMe = new GetMeRoute(PATH)

const UserRoutes = {
  GetMe,
}

export default UserRoutes
