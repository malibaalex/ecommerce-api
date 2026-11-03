import port from "./port.js"
import { PasswordUtil } from "./password.js"
import { env } from "./env.js"
import { CookieUtils } from "./cookie.js"
import { OAuthCookieUtil } from "./oauth-cookie.js"
import OmitProperty from "./omit-property.js"
import TokenUtils from "./token.js"
import IsGoogleUser from "./user-utils.js"
import GoogleProfile from "./google-profile.js"

const Token = new TokenUtils(env)
const Cookie = new CookieUtils(env)
const OauthCookie = new OAuthCookieUtil(env)
const Password = new PasswordUtil()

export const Utils = {
  port,
  OmitProperty,
  Password,
  Token,
  Cookie,
  OauthCookie,
  IsGoogleUser,
  env,
  GoogleProfile,
} as const
