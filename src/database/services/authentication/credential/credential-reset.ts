import BaseService from "@/database/system/base-service.js"

interface ResetPasswordPayload {
  userId: string
  newPassword: string
}

class ResetCredentialService extends BaseService<
  ResetPasswordPayload,
  boolean
> {
  protected async transaction(
    data: ResetPasswordPayload,
  ): Promise<boolean | null> {
    const { userId, newPassword } = data

    const hash = await this.Password.hash(newPassword)

    const updated = await this.database.credential.update({
      where: { userId },
      data: { passwordHash: hash },
    })

    return !!updated
  }
}

export default ResetCredentialService
