import CreateOAuthTransactionService from "./oauth-transaction-create.js"
import ConsumeOAuthTransactionService from "./oauth-transaction-consume.js"

const Create = new CreateOAuthTransactionService()
const Consume = new ConsumeOAuthTransactionService()

const OAuthTransaction = {
  Create,
  Consume,
}

export default OAuthTransaction
