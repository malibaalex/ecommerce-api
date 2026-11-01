import { createHmac, timingSafeEqual } from "crypto"
import type { Request } from "express"
import { Env } from "./env-utils.js"

type OAuthCookieEnv = Pick<Env, "COOKIE_SECRET" | "NODE_ENV">

const COOKIE_NAME = "google_oauth_tx"
const TRANSACTION_TTL_MS = 10 * 60 * 1000

/**
- Encapsulates secure HTTP-only signed transaction cookie management for OAuth.
- Prevents CSRF and tampering via HMAC signatures using injected configuration.
 */
export class OAuthCookieUtil {
  constructor(private readonly env: OAuthCookieEnv) {}

  /**
  - Generates an HMAC-SHA256 signature for the OAuth transaction ID using the configured secret.
  - Ensures message authentication integrity against client-side tampering.
   */
  readonly signTransactionId = (id: string): string => {
    return createHmac("sha256", this.env.COOKIE_SECRET)
      .update(id)
      .digest("base64url")
  }

  /**
  - Combines a transaction ID and its cryptographic signature into a signed cookie value.
  - Formats the resulting string as id.signature for secure transport.
   */
  readonly createSignedCookieValue = (id: string): string => {
    return `${id}.${this.signTransactionId(id)}`
  }

  /**
  - Safely extracts and decodes a specific cookie value from raw request headers.
  - Handles missing cookies or malformed URI components gracefully by returning null.
   */
  readonly readCookie = (request: Request, name: string): string | null => {
    const cookies = request.headers.cookie
    if (!cookies) return null

    const prefix = `${name}=`
    const cookie = cookies
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(prefix))

    if (!cookie) return null

    try {
      return decodeURIComponent(cookie.slice(prefix.length))
    } catch {
      return null
    }
  }

  /**
  - Validates a signed OAuth transaction cookie against expected HMAC signatures.
  - Performs timing-safe comparison to prevent signature verification timing attacks.
   */
  readonly verifySignedCookie = (request: Request): string | null => {
    const value = this.readCookie(request, COOKIE_NAME)
    if (!value) return null

    const separator = value.lastIndexOf(".")
    if (separator === -1) return null

    const id = value.slice(0, separator)
    const receivedSignature = value.slice(separator + 1)

    if (!id || !receivedSignature) return null

    const expectedSignature = this.signTransactionId(id)
    const receivedBuffer = Buffer.from(receivedSignature, "base64url")
    const expectedBuffer = Buffer.from(expectedSignature, "base64url")

    if (receivedBuffer.length !== expectedBuffer.length) return null
    if (!timingSafeEqual(receivedBuffer, expectedBuffer)) return null

    return id
  }

  /**
  - Sets a secure, HTTP-only signed transaction cookie on the Express response.
  - Restricts cookie scope to /api/auth paths with a short TTL window.
   */
  readonly setTransactionCookie = (request: Request, id: string): void => {
    const response = request.res
    if (!response) throw new Error("OAuth response is unavailable")

    response.cookie(COOKIE_NAME, this.createSignedCookieValue(id), {
      httpOnly: true,
      secure: this.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: TRANSACTION_TTL_MS,
    })
  }

  /**
  - Clears the Google OAuth transaction state cookie from the client response.
  - Matches security options and /api/auth path to ensure successful deletion.
   */
  readonly clearCookie = (request: Request): void => {
    request.res?.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: this.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    })
  }
}
