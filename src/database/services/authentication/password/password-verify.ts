import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"

interface VerifyPasswordInput {
  email: string
  password: string
}

class VerifyPasswordService extends BaseService<VerifyPasswordInput, User> {
  protected async transaction(data: VerifyPasswordInput): Promise<User | null> {
    const user = await this.database.user.findUnique({
      where: { email: data.email },
    })

    const ok = await this.Password.verifyOrDummy(
      user?.passwordHash,
      data.password,
    )
    if (!user || !ok) return null

    return user
  }
}

export default VerifyPasswordService
