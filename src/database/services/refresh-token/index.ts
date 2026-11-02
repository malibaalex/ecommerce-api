import SaveRefreshTokenService from "@/database/services/refresh-token/save-refresh-token.js"
import RevokeRefreshTokenService from "@/database/services/refresh-token/revoke-refresh-token.js"
import RotateRefreshTokenService from "./rotate-refresh-token.js"

const SaveRefreshToken = new SaveRefreshTokenService()
const RotateRefreshToken = new RotateRefreshTokenService()
const RevokeRefreshToken = new RevokeRefreshTokenService()

const RefreshTokenServices = {
  SaveRefreshToken,
  RotateRefreshToken,
  RevokeRefreshToken,
}

export default RefreshTokenServices
