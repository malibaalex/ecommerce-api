import { Request, RequestHandler } from "express"
import Base from "@/core/base/base.js"

export interface RateLimitOptions {
  windowMs: number
  limit: number
  keyGenerator?: (req: Request) => string
  message?: string
}

abstract class BaseRateLimiter extends Base {
  private readonly requests = new Map<string, number[]>()

  protected readonly options: RateLimitOptions

  constructor(options: RateLimitOptions) {
    super()

    if (options.limit < 1 || options.windowMs <= 0) {
      throw new Error("Invalid rate limiter configuration")
    }

    this.options = options
  }

  public middleware: RequestHandler = (req, res, next): void => {
    const now = Date.now()

    const key = this.options.keyGenerator?.(req) ?? req.ip ?? "unknown"

    const windowStart = now - this.options.windowMs

    const timestamps = (this.requests.get(key) ?? []).filter(
      (time) => time > windowStart,
    )

    if (timestamps.length >= this.options.limit) {
      const retryAfter = Math.max(
        1,
        Math.ceil((timestamps[0] + this.options.windowMs - now) / 1000),
      )

      res.setHeader("Retry-After", retryAfter)

      this.respond(res, "TOO_MANY_REQUESTS", {
        message: this.options.message,
      })

      return
    }

    timestamps.push(now)
    this.requests.set(key, timestamps)

    res.setHeader("RateLimit-Limit", this.options.limit)
    res.setHeader("RateLimit-Remaining", this.options.limit - timestamps.length)

    next()
  }
}

export default BaseRateLimiter
