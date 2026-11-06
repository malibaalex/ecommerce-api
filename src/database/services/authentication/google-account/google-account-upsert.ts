import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"
import { GoogleIdentity } from "@/types/user.js"

class UpsertGoogleUserService extends BaseService<GoogleIdentity, User> {
  protected async transaction(data: GoogleIdentity): Promise<User | null> {
    const email = data.email.toLowerCase().trim()

    const existingGoogleAccount = await this.database.googleAccount.findUnique({
      where: { googleSub: data.googleSub },
      include: { user: true },
    })

    if (existingGoogleAccount) {
      const { user } = existingGoogleAccount
      if (user.isVerified) return user
      return this.database.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      })
    }

    const existingUser = await this.database.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return this.database.user.update({
        where: { id: existingUser.id },
        data: {
          isVerified: true,
          googleAccount: { create: { googleSub: data.googleSub } },
        },
      })
    }

    return this.database.user.create({
      data: {
        email,
        name: data.name,
        isVerified: true,
        googleAccount: { create: { googleSub: data.googleSub } },
      },
    })
  }
}

export default UpsertGoogleUserService
