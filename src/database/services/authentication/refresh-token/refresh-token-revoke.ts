import BaseService from "@/database/system/base-service.js"

class RevokeRefreshTokenService extends BaseService<string, { count: number }> {
  protected async transaction(token: string): Promise<{ count: number }> {
    return await this.database.refreshToken.deleteMany({
      where: { token: this.Token.hashRefresh(token) },
    })
  }
}

export default RevokeRefreshTokenService
