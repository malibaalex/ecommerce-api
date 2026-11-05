import BaseService from "@/database/system/base-service.js"
import { User, UserStatus } from "@/generated/prisma/client.js"

export interface UpdateUser {
  userId: string
  email?: string
  name?: string
  status?: UserStatus
  isVerified?: boolean
}

class UpdateUserService extends BaseService<UpdateUser, User> {
  protected async transaction(data: UpdateUser): Promise<User | null> {
    const { userId, ...updateData } = data

    return await this.database.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        email: updateData.email
          ? updateData.email.toLowerCase().trim()
          : undefined,
      },
    })
  }
}

export default UpdateUserService
