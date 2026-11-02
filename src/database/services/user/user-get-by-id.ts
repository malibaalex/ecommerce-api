import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"

class GetUserByIdService extends BaseService<string, User> {
  protected async transaction(userId: string): Promise<User | null> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    })

    return user ?? null
  }
}

export default GetUserByIdService
