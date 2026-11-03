import BaseService from "@/database/system/base-service.js"
import { OtpCode } from "@/generated/prisma/client.js"
import OtpHasher from "@/core/utils/otp.js"

type CreateOtpInput = {
  userId: string
  purpose: string
  code: string
  expiresAt: Date
}

class CreateOtpCodeService extends BaseService<CreateOtpInput, OtpCode> {
  protected async transaction(data: CreateOtpInput): Promise<OtpCode | null> {
    await this.database.otpCode.updateMany({
      where: {
        userId: data.userId,
        purpose: data.purpose,
        consumedAt: null,
      },
      data: { consumedAt: new Date() },
    })

    const codeHash = OtpHasher.hash(data.code)

    return await this.database.otpCode.create({
      data: {
        userId: data.userId,
        purpose: data.purpose,
        codeHash,
        expiresAt: data.expiresAt,
      },
    })
  }
}

export default CreateOtpCodeService
