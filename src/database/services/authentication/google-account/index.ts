import UpsertGoogleUserService from "./google-account-upsert.js"

const UpsertUser = new UpsertGoogleUserService()

const GoogleAccount = {
  UpsertUser,
}

export default GoogleAccount
