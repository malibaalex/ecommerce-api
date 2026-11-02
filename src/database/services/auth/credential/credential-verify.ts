import BaseService from "@/database/system/base-service.js"
import { Credential } from "@/generated/prisma/client.js"
import { SignIn } from "@/types/user.js"

class VerifyCredentialService extends BaseService<SignIn, Credential> {
  protected async transaction(data: SignIn): Promise<Credential | null> {
    const user = await this.database.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
      include: { credential: true },
    })

    if (!user || !user.credential) {
      return null
    }

    const isValid = await this.Password.verify(
      data.password,
      user.credential.passwordHash,
    )

    if (!isValid) {
      return null
    }

    return user.credential
  }
}

export default VerifyCredentialService
