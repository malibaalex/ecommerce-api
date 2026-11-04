import BaseService from "@/database/system/base-service.js"

interface CreateSessionInput {
  userId: string
  code: string
  expiresAt: Date
}

class CreateSignInSessionService extends BaseService<
  CreateSessionInput,
  { sessionId: string }
> {
  protected async transaction(
    data: CreateSessionInput,
  ): Promise<{ sessionId: string } | null> {
    // Only the newest session for a user can complete
    await this.database.signInSession.updateMany({
      where: { userId: data.userId, consumedAt: null },
      data: { consumedAt: new Date() },
    })

    const codeHash = this.OptHasher.hash(data.code)

    const session = await this.database.signInSession.create({
      data: {
        userId: data.userId,
        expiresAt: data.expiresAt,
        otpCodes: { create: { codeHash, expiresAt: data.expiresAt } },
      },
      select: { id: true },
    })
    return { sessionId: session.id }
  }
}

export default CreateSignInSessionService
