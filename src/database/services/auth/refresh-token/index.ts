import SaveRefreshTokenService from "@/database/services/auth/refresh-token/refresh-token-save.js"
import RotateRefreshTokenService from "./refresh-token-rotate.js"
import RevokeRefreshTokenService from "@/database/services/auth/refresh-token/refresh-token-revoke.js"

const SaveRefreshToken = new SaveRefreshTokenService()
const RotateRefreshToken = new RotateRefreshTokenService()
const RevokeRefreshToken = new RevokeRefreshTokenService()

const RefreshToken = {
  SaveRefreshToken,
  RotateRefreshToken,
  RevokeRefreshToken,
}

export default RefreshToken
