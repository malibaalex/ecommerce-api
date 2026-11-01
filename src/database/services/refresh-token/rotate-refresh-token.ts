import BaseService from "@/database/system/base-service.js"
import { type RefreshToken } from "@/generated/prisma/client.js"

interface RotateRefreshTokenInput {
  oldToken: string
}

class RotateRefreshTokenService extends BaseService<
  RotateRefreshTokenInput,
  RefreshToken
> {
  protected async transaction(
    data: RotateRefreshTokenInput,
  ): Promise<RefreshToken | null> {
    const oldToken = await this.database.refreshToken.findUnique({
      where: { token: data.oldToken },
    })

    if (!oldToken) return null

    if (oldToken.expiresAt < new Date()) {
      await this.database.refreshToken.delete({
        where: { id: oldToken.id },
      })
      return null
    }

    await this.database.refreshToken.delete({
      where: { id: oldToken.id },
    })

    const newToken = this.token.signRefresh({ userId: oldToken.userId })

    return await this.database.refreshToken.create({
      data: {
        token: newToken,
        userId: oldToken.userId,
        expiresAt: new Date(
          Date.now() + this.env.JWT_REFRESH_SECRET_KEY_EXPIRES_IN * 1000,
        ),
      },
    })
  }
}

export default RotateRefreshTokenService
