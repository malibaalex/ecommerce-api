import type { Request } from "express"
import Base from "@/core/base/base.js"

class GoogleStateStore extends Base {
  private readonly ttlMs = 10 * 60 * 1000

  // Keep exactly 5 plain params: passport-oauth2 picks the PKCE form via store.length
  readonly store = async (
    req: Request,
    verifier: string,
    _state: unknown,
    _meta: unknown,
    callback: (err: Error | null, state?: string) => void,
  ): Promise<void> => {
    try {
      const state = crypto.randomUUID()
      const expiresAt = new Date(Date.now() + this.ttlMs)

      const transaction =
        await this.Services.Authenticate.OAuthTransaction.Create.call({
          state,
          codeVerifier: verifier,
          expiresAt,
        })

      if (!transaction) {
        return callback(new Error("Failed to create OAuth transaction"))
      }

      this.Utils.OauthCookie.setTransactionCookie(req, transaction.id)
      callback(null, state)
    } catch (error) {
      callback(error as Error)
    }
  }

  // Keep exactly 3 plain params
  readonly verify = async (
    req: Request,
    providedState: string,
    callback: (err: Error | null, ok: string | false, state?: string) => void,
  ): Promise<void> => {
    try {
      const cookieTransactionId = this.Utils.OauthCookie.verifySignedCookie(req)
      if (!cookieTransactionId) return callback(null, false)

      const codeVerifier =
        await this.Services.Authenticate.OAuthTransaction.Consume.call({
          state: providedState,
          cookieTransactionId,
        })
      if (!codeVerifier) return callback(null, false)

      // Returning the verifier string is what sends code_verifier to Google
      callback(null, codeVerifier, providedState)
    } catch (error) {
      callback(error as Error, false)
    }
  }
}

const googleStateStore = new GoogleStateStore()

export default googleStateStore
