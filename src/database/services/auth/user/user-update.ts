import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"
import { UpdateUser } from "@/types/user.js"

class UpdateUserService extends BaseService<UpdateUser, User> {
  protected async transaction(data: UpdateUser): Promise<User | null> {
    const { userId, ...updateData } = data

    const result = await this.database.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        email: updateData.email
          ? updateData.email.toLowerCase().trim()
          : undefined,
      },
    })

    return result ?? null
  }
}

export default UpdateUserService
