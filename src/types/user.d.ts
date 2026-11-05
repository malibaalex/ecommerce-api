import { UserStatus } from "@/generated/prisma/enums.ts"

export interface UserAuthState {
  id: string
  email: string
  status: UserStatus
  isVerified: boolean
  hasPassword: boolean
}

export interface GoogleIdentity {
  googleSub: string
  email: string
  isVerified: true
  name: string | null
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
