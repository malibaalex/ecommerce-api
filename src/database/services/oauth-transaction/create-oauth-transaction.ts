import BaseService from "@/database/system/base-service.js"
import { OAuthTransaction } from "@/generated/prisma/client.js"

interface CreateOAuthTransactionInput {
  state: string
  codeVerifier: string
  expiresAt: Date
}

class CreateOAuthTransactionService extends BaseService<
  CreateOAuthTransactionInput,
  OAuthTransaction
> {
  protected async transaction(
    data: CreateOAuthTransactionInput,
  ): Promise<OAuthTransaction | null> {
    const result = await this.database.oAuthTransaction.create({
      data: {
        state: data.state,
        codeVerifier: data.codeVerifier,
        expiresAt: data.expiresAt,
      },
    })

    return result ?? null
  }
}

export default CreateOAuthTransactionService
