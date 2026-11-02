import BaseService from "@/database/system/base-service.js"

interface ConsumeOAuthTransactionInput {
  state: string
  cookieTransactionId: string
}

class ConsumeOAuthTransactionService extends BaseService<
  ConsumeOAuthTransactionInput,
  string
> {
  protected async transaction(
    data: ConsumeOAuthTransactionInput,
  ): Promise<string | null> {
    const now = new Date()

    const transaction = await this.database.oAuthTransaction.findUnique({
      where: { state: data.state },
    })

    if (
      !transaction ||
      transaction.id !== data.cookieTransactionId ||
      transaction.expiresAt <= now
    ) {
      return null
    }

    // Atomic one-time consumption / deletion
    const consumed = await this.database.oAuthTransaction.deleteMany({
      where: {
        id: transaction.id,
        state: data.state,
        expiresAt: { gt: now },
      },
    })

    if (consumed.count !== 1) {
      return null
    }

    return transaction.codeVerifier
  }
}

export default ConsumeOAuthTransactionService
