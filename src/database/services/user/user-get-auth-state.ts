import BaseService from "@/database/system/base-service.js"
import { UserAuthState } from "@/types/user.js"

class GetUserAuthStateService extends BaseService<string, UserAuthState> {
  protected async transaction(email: string): Promise<UserAuthState | null> {
    const user = await this.database.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        status: true,
        isVerified: true,
        passwordHash: true,
      },
    })
    if (!user) return null

    const { passwordHash, ...rest } = user
    return { ...rest, hasPassword: passwordHash !== null }
  }
}

export default GetUserAuthStateService
