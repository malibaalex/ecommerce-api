import ConsumeOAuthTransactionService from "./consume-oauth-transaction.js"
import CreateOAuthTransactionService from "./create-oauth-transaction.js"

const CreateOAuthTransaction = new CreateOAuthTransactionService()
const ConsumeOAuthTransaction = new ConsumeOAuthTransactionService()

const OAuthTransactionServices = {
  CreateOAuthTransaction,
  ConsumeOAuthTransaction,
}

export default OAuthTransactionServices
