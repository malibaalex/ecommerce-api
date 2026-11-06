import { Response, CookieOptions } from "express"
import { Env } from "./env.js"

type CookieEnv = Pick<
  Env,
  | "NODE_ENV"
  | "JWT_ACCESS_SECRET_KEY_EXPIRES_IN"
  | "JWT_REFRESH_SECRET_KEY_EXPIRES_IN"
>

/**
- Encapsulates secure HTTP-only cookie management for authentication tokens.
- Automatically configures security flags like secure, httpOnly, and strict sameSite based on environment.
 */
class CookieUtils {
  private readonly accessOptions: CookieOptions
  private readonly refreshOptions: CookieOptions

  constructor(private readonly env: CookieEnv) {
    const base: CookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    }
    this.accessOptions = { ...base, path: "/api" }
    this.refreshOptions = { ...base, path: "/api/auth" }
  }

  setAccessCookie(res: Response, token: string): void {
    res.cookie("access_token", token, {
      ...this.accessOptions,
      maxAge: this.env.JWT_ACCESS_SECRET_KEY_EXPIRES_IN * 1000,
    })
  }

  setRefreshCookie(res: Response, token: string): void {
    res.cookie("refresh_token", token, {
      ...this.refreshOptions,
      maxAge: this.env.JWT_REFRESH_SECRET_KEY_EXPIRES_IN * 1000,
    })
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie("access_token", this.accessOptions)
    res.clearCookie("refresh_token", this.refreshOptions)
  }
}

export default CookieUtils
