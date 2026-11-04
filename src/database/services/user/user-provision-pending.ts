import BaseService from "@/database/system/base-service.js"
import { UserAuthState } from "@/types/user.js"

class ProvisionPendingUserService extends BaseService<string, UserAuthState> {
  protected async transaction(email: string): Promise<UserAuthState | null> {
    const user = await this.database.user.upsert({
      where: { email },
      update: {},
      create: { email, isVerified: false },
      select: { id: true, email: true, status: true, isVerified: true },
    })
    return { ...user, hasPassword: false }
  }
}

export default ProvisionPendingUserService
