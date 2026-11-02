import port from "./port.js"
import { PasswordUtil } from "./password.js"
import { env } from "./env.js"
import { CookieUtils } from "./cookie.js"
import { OAuthCookieUtil } from "./oauth-cookie.js"
import omitProperty from "./omit-property.js"
import TokenUtils from "./token.js"
import logger from "./logger.js"
import isGoogleUser from "./user-utils.js"

const tokenUtils = new TokenUtils(env)
const cookieUtils = new CookieUtils(env)
const oauthCookieUtils = new OAuthCookieUtil(env)
const passwordUtil = new PasswordUtil()

export const Utils = {
  port,
  omitProperty,
  password: passwordUtil,
  token: tokenUtils,
  cookie: cookieUtils,
  oauthCookie: oauthCookieUtils,
  logger,
  isGoogleUser,
  env,
} as const
