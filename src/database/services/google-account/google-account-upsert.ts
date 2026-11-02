import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"
import { GoogleIdentity } from "@/types/user.js"

class UpsertGoogleUserService extends BaseService<GoogleIdentity, User> {
  protected async transaction(data: GoogleIdentity): Promise<User | null> {
    const email = data.email.toLowerCase().trim()

    // Check if Google account already exists by sub
    const existingGoogleAccount = await this.database.googleAccount.findUnique({
      where: { googleSub: data.googleSub },
      include: { user: true },
    })

    if (existingGoogleAccount) {
      return existingGoogleAccount.user
    }

    // Check if user exists by email to link accounts
    const existingUser = await this.database.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      const user = await this.database.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerified: true,
          googleAccount: {
            create: {
              googleSub: data.googleSub,
            },
          },
        },
      })
      return user
    }

    // Otherwise, create new user + google account
    const newUser = await this.database.user.create({
      data: {
        email,
        name: data.name,
        emailVerified: true,
        googleAccount: {
          create: {
            googleSub: data.googleSub,
          },
        },
      },
    })

    return newUser ?? null
  }
}

export default UpsertGoogleUserService
