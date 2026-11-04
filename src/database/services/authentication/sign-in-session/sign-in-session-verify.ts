import BaseService from "@/database/system/base-service.js"
import { User } from "@/generated/prisma/client.js"

interface VerifySessionInput {
  sessionId: string
  code: string
}

class VerifySignInSessionService extends BaseService<VerifySessionInput, User> {
  private dummyHash: string | null = null

  /** Burns the same CPU as a real check, so decoy and real sessions look identical. */
  private burn(code: string): null {
    this.dummyHash ??= this.OptHasher.hash("000000")
    this.OptHasher.verify(code, this.dummyHash!)
    return null
  }

  protected async transaction(data: VerifySessionInput): Promise<User | null> {
    const now = new Date()

    const session = await this.database.signInSession.findFirst({
      where: { id: data.sessionId, consumedAt: null, expiresAt: { gt: now } },
      include: { user: { select: { status: true } } },
    })
    if (!session || session.user.status !== "active")
      return this.burn(data.code)

    const otp = await this.database.otpCode.findFirst({
      where: {
        sessionId: session.id,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    })
    if (!otp) return this.burn(data.code)

    if (!this.OptHasher.verify(data.code, otp.codeHash)) return null

    // Single-use: code, then session
    const otpConsumed = await this.database.otpCode.updateMany({
      where: { id: otp.id, consumedAt: null },
      data: { consumedAt: now },
    })
    if (otpConsumed.count !== 1) return null

    const sessionConsumed = await this.database.signInSession.updateMany({
      where: { id: session.id, consumedAt: null },
      data: { consumedAt: now },
    })
    if (sessionConsumed.count !== 1) return null

    return await this.database.user.update({
      where: { id: session.userId },
      data: { isVerified: true },
    })
  }
}

export default VerifySignInSessionService
