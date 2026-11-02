import ConsumeOAuthTransactionService from "./oauth-transaction-consume.js"
import CreateOAuthTransactionService from "./oauth-transaction-create.js"

const CreateOAuthTransaction = new CreateOAuthTransactionService()
const ConsumeOAuthTransaction = new ConsumeOAuthTransactionService()

const OAuthTransactionServices = {
  CreateOAuthTransaction,
  ConsumeOAuthTransaction,
}

export default OAuthTransactionServices
