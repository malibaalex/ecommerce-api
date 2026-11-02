import IdValidator from "@/app/validators/validator-id.js"
import Auth from "./auth/index.js"

const Id = new IdValidator()

const Validators = { Id, Auth }

export default Validators
