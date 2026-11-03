import { RateLimitOptions } from "@/types/app.js"
import { Request } from "express"

interface CustomLimitParams {
  limit?: number
  minutes?: number
  windowMs?: number
  message?: string
  keyGenerator?: (req: Request) => string
}

class RateLimitUtils {
  /**
   * Generates a dynamic rate limit configuration.
   * Automatically handles `windowMs` (even if passed as a shorthand like `15` for minutes),
   * `currentUser.id` / `email`, or `req.body.email`, falling back to IP tracking.
   */
  configure(params: CustomLimitParams = {}): RateLimitOptions {
    const { limit = 20, minutes, windowMs, message, keyGenerator } = params

    // Smart fallback: If windowMs is small (e.g., <= 1000), treat it as minutes.
    // Otherwise, use windowMs or default to the minutes param (or 5 minutes).
    let computedWindowMs: number
    if (windowMs !== undefined) {
      computedWindowMs = windowMs <= 1000 ? windowMs * 60 * 1000 : windowMs
    } else {
      computedWindowMs = (minutes ?? 5) * 60 * 1000
    }

    const calculatedMinutes = Math.ceil(computedWindowMs / (60 * 1000))

    return {
      windowMs: computedWindowMs,
      limit,
      keyGenerator:
        keyGenerator ??
        ((req: Request) => {
          const ip = req.ip ?? "unknown"
          const userId =
            req.currentUser && "id" in req.currentUser
              ? (req.currentUser.id as string)
              : undefined
          const email =
            req.currentUser && "email" in req.currentUser
              ? (req.currentUser.email as string)
              : req.body?.email

          const identifier = email ?? userId

          return identifier ? `${ip}_${identifier}` : ip
        }),
      message:
        message ??
        `Too many requests. Please try again in ${calculatedMinutes} minute(s).`,
    }
  }

  /**
   * Alias for configure to support `.create(...)` syntax in route definitions.
   */
  create(params: CustomLimitParams = {}): RateLimitOptions {
    return this.configure(params)
  }
}

export default RateLimitUtils
