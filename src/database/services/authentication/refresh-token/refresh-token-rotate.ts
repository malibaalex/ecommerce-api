import BaseService from "@/database/system/base-service.js"
import type { User } from "@/generated/prisma/client.js"

interface RotateRefreshTokenInput {
  oldToken: string
}

interface RotateRefreshTokenResult {
  token: string // raw, goes into the cookie
  user: User
}

class RotateRefreshTokenService extends BaseService<
  RotateRefreshTokenInput,
  RotateRefreshTokenResult
> {
  protected async transaction(
    data: RotateRefreshTokenInput,
  ): Promise<RotateRefreshTokenResult | null> {
    const stored = await this.database.refreshToken.findUnique({
      where: { token: this.Token.hashRefresh(data.oldToken) },
      include: { user: true },
    })
    if (!stored) return null

    // Atomic claim: only one concurrent request can delete the row
    const { count } = await this.database.refreshToken.deleteMany({
      where: { id: stored.id },
    })
    if (count === 0) return null

    if (stored.expiresAt < new Date() || stored.user.status === "suspended") {
      return null
    }

    const token = this.Token.signRefresh({ userId: stored.userId })

    await this.database.refreshToken.create({
      data: {
        token: this.Token.hashRefresh(token),
        userId: stored.userId,
        expiresAt: new Date(
          Date.now() + this.env.JWT_REFRESH_SECRET_KEY_EXPIRES_IN * 1000,
        ),
      },
    })

    return { token, user: stored.user }
  }
}

export default RotateRefreshTokenService
