import IdValidator from "@/app/validators/validator-id.js"
import Authenticate from "./authentication/index.js"

const Id = new IdValidator()

const Validators = { Id, Authenticate }

export default Validators
