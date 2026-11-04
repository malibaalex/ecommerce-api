import GetUserAuthStateService from "./user-get-auth-state.js"
import GetUserByIdService from "./user-get-by-id.js"
import GetOneUserByEmailService from "./user-get-one-by-email.js"
import ProvisionPendingUserService from "./user-provision-pending.js"
import UpdateUserService from "./user-update.js"

const GetById = new GetUserByIdService()
const GetByEmail = new GetOneUserByEmailService()
const Update = new UpdateUserService()
const GetAuthState = new GetUserAuthStateService()
const ProvisionPending = new ProvisionPendingUserService()

const User = {
  GetById,
  GetByEmail,
  Update,
  GetAuthState,
  ProvisionPending,
}

export default User
