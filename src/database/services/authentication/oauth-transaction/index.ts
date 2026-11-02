import CreateOAuthTransactionService from "./oauth-transaction-create.js"
import ConsumeOAuthTransactionService from "./oauth-transaction-consume.js"

const CreateOAuthTransaction = new CreateOAuthTransactionService()
const ConsumeOAuthTransaction = new ConsumeOAuthTransactionService()

const OAuthTransaction = {
  CreateOAuthTransaction,
  ConsumeOAuthTransaction,
}

export default OAuthTransaction
