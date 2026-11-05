import port from "./port.js"
import { PasswordUtil } from "./password.js"
import { env } from "./env.js"
import { CookieUtils } from "./cookie.js"
import { OAuthCookieUtil } from "./oauth-cookie.js"
import OmitProperty from "./omit-property.js"
import TokenUtils from "./token.js"
import GoogleProfile from "./google-profile.js"
import RateLimitUtils from "./rate-limit.js"
import OtpHasherUtil from "./otp.js"

const Token = new TokenUtils(env)
const Cookie = new CookieUtils(env)
const OauthCookie = new OAuthCookieUtil(env)
const Password = new PasswordUtil()
const RateLimits = new RateLimitUtils()
const OtpHasher = new OtpHasherUtil()

export const Utils = {
  port,
  OmitProperty,
  Password,
  Token,
  Cookie,
  OauthCookie,
  env,
  GoogleProfile,
  RateLimits,
  OtpHasher,
} as const
