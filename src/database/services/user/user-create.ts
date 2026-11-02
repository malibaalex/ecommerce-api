import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"
import { Signup } from "@/types/user.js"

class CreateUserService extends BaseService<Signup, User> {
  protected async transaction(data: Signup): Promise<User | null> {
    const hash = await this.Password.hash(data.password)

    const result = await this.database.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name,
        credential: {
          create: {
            passwordHash: hash,
          },
        },
      },
    })

    return result ?? null
  }
}

export default CreateUserService
