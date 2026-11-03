import BaseRateLimiter from "@/core/base/rate-limit/base-rate-limit.js"

class RateLimiter extends BaseRateLimiter {}

const RateLimit = {
  /**
   * Creates a rate limiting middleware.
   *
   * @param options - Configuration options:
   *   - `limit`: Max requests (default: 20)
   *   - `windowMs`: Time window in ms, or minutes if passed as a small number (default: 5 mins)
   *   - `message`: Custom error message
   *   - `keyGenerator`: Custom key generator function
   */
  create: (options: ConstructorParameters<typeof RateLimiter>[0]) =>
    new RateLimiter(options).middleware,
}

export default RateLimit
