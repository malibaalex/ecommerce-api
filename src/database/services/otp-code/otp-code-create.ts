import BaseService from "@/database/system/base-service.js"
import { OtpCode } from "@/generated/prisma/client.js"

type CreateOtpInput = {
  userId: string
  purpose: string
  codeHash: string
  expiresAt: Date
}

class CreateOtpCodeService extends BaseService<CreateOtpInput, OtpCode> {
  protected async transaction(data: CreateOtpInput): Promise<OtpCode | null> {
    // Invalidate any existing active codes for this user & purpose
    await this.database.otpCode.updateMany({
      where: {
        userId: data.userId,
        purpose: data.purpose,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    })

    const otpCode = await this.database.otpCode.create({
      data: {
        userId: data.userId,
        purpose: data.purpose,
        codeHash: data.codeHash,
        expiresAt: data.expiresAt,
      },
    })

    return otpCode ?? null
  }
}

export default CreateOtpCodeService
