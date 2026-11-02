import BaseRateLimiter, {
  RateLimitOptions,
} from "@/core/base/base-rate-limit.js"

class RateLimiter extends BaseRateLimiter {
  constructor(options: RateLimitOptions) {
    super(options)
  }
}

export default RateLimiter
