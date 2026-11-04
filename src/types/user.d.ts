import { UserStatus } from "@/generated/prisma/enums.ts"

/**
- Represents standard Google OIDC identity claims returned during authentication.
- Defines core Google account properties including sub, email, verification, and name.
 */
export interface GoogleIdentity {
  googleSub: string
  email: string
  isVerified: true
  name: string | null
}

export interface GoogleUser
  extends Omit<SafeUser, keyof GoogleIdentity>, GoogleIdentity {}

export interface UserAuthState {
  id: string
  email: string
  status: UserStatus
  isVerified: boolean
  hasPassword: boolean
}

export type UpdateUser = {
  userId: string
  email?: string
  name?: string
  status?: UserStatus
  isVerified?: boolean
}

export type JwtPayload = {
  payload: {
    id: string
    email: string
    name: string | null
    status: UserStatus
    isVerified: boolean
    createdAt: Date
    updatedAt: Date
  }
  iat: number
  exp: number
}

export type AccessPayload = Omit<JwtPayload, "iat" | "exp">
export type RefreshPayload = { userId: string }
export type VerifiedRefreshPayload = RefreshPayload & {
  iat: number
  exp: number
}
