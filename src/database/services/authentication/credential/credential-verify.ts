import BaseService from "@/database/system/base-service.js"
import { Credential, User } from "@/generated/prisma/client.js"
import { SignIn } from "@/types/user.js"

type CredentialWithUser = Credential & { user: User }

class VerifyCredentialService extends BaseService<SignIn, CredentialWithUser> {
  protected async transaction(
    data: SignIn,
  ): Promise<CredentialWithUser | null> {
    const email = data.email.toLowerCase().trim()

    const user = await this.database.user.findUnique({
      where: { email },
      include: { credential: true },
    })

    // Check if user exists, has password credentials, and is active
    if (!user || !user.credential || user.status === "suspended") {
      return null
    }

    const isValid = await this.Password.verify(
      data.password,
      user.credential.passwordHash,
    )

    if (!isValid) {
      return null
    }

    return {
      ...user.credential,
      user,
    }
  }
}

export default VerifyCredentialService
