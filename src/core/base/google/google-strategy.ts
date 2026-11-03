import passport from "passport"
import type { Request, RequestHandler, Response } from "express"
import {
  Strategy,
  type Profile,
  type StrategyOptions,
  type VerifyCallback,
} from "passport-google-oauth20"
import Base from "@/core/base/base.js"
import googleStateStore from "./google-state-store.js"
import type { GoogleProfileErrorCode } from "@/core/utils/google-profile.js"
import type { GoogleIdentity } from "@/types/user.js"

type PassportStateStore = NonNullable<StrategyOptions["store"]>

export type GoogleAuthErrorCode = GoogleProfileErrorCode | "oauth_failed"

export type GoogleAuthResult =
  | { ok: true; identity: GoogleIdentity }
  | { ok: false; code: GoogleAuthErrorCode }

class GoogleStrategy extends Base {
  private readonly name = "google"
  private readonly scope = ["openid", "email", "profile"]

  /** Middleware for GET /auth/google: redirects the user to Google. */
  readonly redirect: RequestHandler = passport.authenticate(this.name, {
    session: false,
    scope: this.scope,
    prompt: "select_account",
  })

  constructor() {
    super()
    const { env } = this.Utils

    passport.use(
      this.name,
      new Strategy(
        {
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          callbackURL: env.GOOGLE_CALLBACK_URL,
          scope: this.scope,
          pkce: true,
          store: googleStateStore as unknown as PassportStateStore,
        },
        this.verify,
      ),
    )
  }

  /** Runs the callback leg and resolves with a typed result. */
  authenticate(req: Request, res: Response): Promise<GoogleAuthResult> {
    return new Promise((resolve) => {
      passport.authenticate(
        this.name,
        { session: false },
        (
          err: Error | null,
          identity: GoogleIdentity | false | null,
          info: { code?: GoogleAuthErrorCode } | undefined,
        ) => {
          if (err || !identity) {
            return resolve({ ok: false, code: info?.code ?? "oauth_failed" })
          }
          resolve({ ok: true, identity })
        },
      )(req, res, () => resolve({ ok: false, code: "oauth_failed" }))
    })
  }

  private readonly verify = (
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void => {
    const result = this.Utils.GoogleProfile.parse(profile)
    if (!result.ok) return done(null, false, { code: result.code })
    done(null, result.identity)
  }
}

const googleStrategy = new GoogleStrategy()

export default googleStrategy
