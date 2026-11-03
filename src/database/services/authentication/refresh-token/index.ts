import SaveRefreshTokenService from "@/database/services/authentication/refresh-token/refresh-token-save.js"
import RotateRefreshTokenService from "./refresh-token-rotate.js"
import RevokeRefreshTokenService from "@/database/services/authentication/refresh-token/refresh-token-revoke.js"

const Save = new SaveRefreshTokenService()
const Rotate = new RotateRefreshTokenService()
const Revoke = new RevokeRefreshTokenService()

const RefreshToken = {
  Save,
  Rotate,
  Revoke,
}

export default RefreshToken
