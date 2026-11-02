import port from "./port.js"
import { PasswordUtil } from "./password.js"
import { env } from "./env.js"
import { CookieUtils } from "./cookie.js"
import { OAuthCookieUtil } from "./oauth-cookie.js"
import omitProperty from "./omit-property.js"
import TokenUtils from "./token.js"
import isGoogleUser from "./user-utils.js"

const Token = new TokenUtils(env)
const Cookie = new CookieUtils(env)
const OauthCookie = new OAuthCookieUtil(env)
const Password = new PasswordUtil()

export const Utils = {
  port,
  omitProperty,
  Password,
  Token,
  Cookie,
  OauthCookie,
  isGoogleUser,
  env,
} as const
