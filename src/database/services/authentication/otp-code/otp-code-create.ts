import BaseService from "@/database/system/base-service.js"
import { OtpCode } from "@/generated/prisma/client.js"

type CreateOtpInput = {
  sessionId: string
  code: string
  expiresAt: Date
}

class CreateOtpCodeService extends BaseService<CreateOtpInput, OtpCode> {
  protected async transaction(data: CreateOtpInput): Promise<OtpCode | null> {
    // Invalidate any existing unconsumed codes for this session
    await this.database.otpCode.updateMany({
      where: {
        sessionId: data.sessionId,
        consumedAt: null,
      },
      data: { consumedAt: new Date() },
    })

    const codeHash = this.OptHasher.hash(data.code)

    return await this.database.otpCode.create({
      data: {
        sessionId: data.sessionId,
        codeHash,
        expiresAt: data.expiresAt,
      },
    })
  }
}

export default CreateOtpCodeService
