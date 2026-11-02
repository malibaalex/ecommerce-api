import RateLimiter from "./rate-limiter.js"

const RateLimit = {
  create: (options: ConstructorParameters<typeof RateLimiter>[0]) =>
    new RateLimiter(options).middleware,
}

export default RateLimit
