import SaveRefreshTokenService from "@/database/services/refresh-token/refresh-token-save.js"
import RevokeRefreshTokenService from "@/database/services/refresh-token/refresh-token-revoke.js"
import RotateRefreshTokenService from "./refresh-token-rotate.js"

const SaveRefreshToken = new SaveRefreshTokenService()
const RotateRefreshToken = new RotateRefreshTokenService()
const RevokeRefreshToken = new RevokeRefreshTokenService()

const RefreshTokenServices = {
  SaveRefreshToken,
  RotateRefreshToken,
  RevokeRefreshToken,
}

export default RefreshTokenServices
