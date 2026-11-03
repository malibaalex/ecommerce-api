import CreateUserService from "./user-create.js"
import GetUserByIdService from "./user-get-by-id.js"
import GetOneUserByEmailService from "./user-get-one-by-email.js"
import UpdateUserService from "./user-update.js"

const Create = new CreateUserService()
const GetById = new GetUserByIdService()
const GetByEmail = new GetOneUserByEmailService()
const Update = new UpdateUserService()

const User = {
  Create,
  GetById,
  GetByEmail,
  Update,
}

export default User
