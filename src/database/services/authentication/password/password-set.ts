import BaseService from "@/database/system/base-service.js"

interface PasswordInput {
  userId: string
  password: string
}

class SetPasswordService extends BaseService<
  PasswordInput,
  { updated: boolean }
> {
  protected async transaction(
    data: PasswordInput,
  ): Promise<{ updated: boolean } | null> {
    const passwordHash = await this.Password.hash(data.password)

    // Only fills an empty slot, so an existing password can never be overwritten
    const result = await this.database.user.updateMany({
      where: { id: data.userId, passwordHash: null },
      data: { passwordHash },
    })
    return { updated: result.count === 1 }
  }
}

export default SetPasswordService
