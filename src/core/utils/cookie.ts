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
export class CookieUtils {
  private readonly options: CookieOptions

  constructor(private readonly env: CookieEnv) {
    this.options = {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth",
    }
  }

  /**
  - Sets the secure HTTP-only access token cookie with appropriate expiration time.
  - Converts JWT expiration seconds into millisecond maxAge required by Express cookies.
   */
  setAccessCookie(res: Response, token: string): void {
    res.cookie("access_token", token, {
      ...this.options,
      maxAge: this.env.JWT_ACCESS_SECRET_KEY_EXPIRES_IN * 1000, // cookie maxAge is ms
    })
  }

  /**
  - Sets the secure HTTP-only refresh token cookie with its longer expiration time.
  - Protects long-lived refresh tokens from cross-site scripting and unauthorized access.
   */
  setRefreshCookie(res: Response, token: string): void {
    res.cookie("refresh_token", token, {
      ...this.options,
      maxAge: this.env.JWT_REFRESH_SECRET_KEY_EXPIRES_IN * 1000,
    })
  }

  /**
  - Clears both access and refresh authentication cookies from the client response.
  - Uses matching security configuration options to ensure proper cookie deletion.
   */
  clearAuthCookies(res: Response): void {
    res.clearCookie("access_token", this.options)
    res.clearCookie("refresh_token", this.options)
  }
}
