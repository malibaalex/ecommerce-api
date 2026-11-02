import BaseService from "@/database/system/base-service.js"
import { OtpCode } from "@/generated/prisma/client.js"

interface VerifyOtpInput {
  userId: string
  purpose: string
  codeHash: string
}

class VerifyOtpCodeService extends BaseService<VerifyOtpInput, OtpCode> {
  protected async transaction(data: VerifyOtpInput): Promise<OtpCode | null> {
    const now = new Date()

    const otpCode = await this.database.otpCode.findFirst({
      where: {
        userId: data.userId,
        purpose: data.purpose,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    })

    if (!otpCode) {
      return null
    }

    if (otpCode.attempts >= 5) {
      return null
    }

    if (otpCode.codeHash !== data.codeHash) {
      await this.database.otpCode.update({
        where: { id: otpCode.id },
        data: { attempts: { increment: 1 } },
      })
      return null
    }

    // Mark code as consumed
    const consumed = await this.database.otpCode.update({
      where: { id: otpCode.id },
      data: { consumedAt: now },
    })

    return consumed
  }
}

export default VerifyOtpCodeService
