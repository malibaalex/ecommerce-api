import CreateUserService from "./user-create.js"
import GetUserByIdService from "./user-get-by-id.js"
import GetOneUserByEmailService from "./user-get-one-by-email.js"
import UpdateUserService from "./user-update.js"

const CreateUser = new CreateUserService()
const GetUserById = new GetUserByIdService()
const GetUserByEmail = new GetOneUserByEmailService()
const UpdateUser = new UpdateUserService()

const UserServices = {
  CreateUser,
  GetUserById,
  GetUserByEmail,
  UpdateUser,
}

export default UserServices
