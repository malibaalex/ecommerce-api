import { UserStatus } from "@/generated/prisma/enums.ts"

/**
- Represents standard Google OIDC identity claims returned during authentication.
- Defines core Google account properties including sub, email, verification, and name.
 */
export interface GoogleIdentity {
  googleSub: string
  email: string
  emailVerified: true
  name: string | null
}

// User row + Google identity. Omit avoids "cannot extend" clashes where
// both sides declare the same field with slightly different types.
export interface GoogleUser
  extends Omit<User, keyof GoogleIdentity>, GoogleIdentity {}

export type Signup = {
  email: string
  name?: string
  password: string
}

export type SignIn = {
  email: string
  password: string
}

export type UpdateUser = {
  userId: string
  email?: string
  name?: string
  status?: UserStatus
  emailVerified?: boolean
}

export type JwtPayload = {
  payload: {
    userId: string
    email: string
    name: string | null
    status: UserStatus
    emailVerified: boolean
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
