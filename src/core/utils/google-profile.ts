import type { Profile } from "passport-google-oauth20"
import type { GoogleIdentity } from "@/types/user.js"

export type GoogleProfileErrorCode = "invalid_profile" | "email_not_verified"

export type GoogleProfileResult =
  | { ok: true; identity: GoogleIdentity }
  | { ok: false; code: GoogleProfileErrorCode }

class GoogleProfile {
  parse(profile: Profile): GoogleProfileResult {
    const raw: Record<string, unknown> = profile._json

    if (typeof raw.sub !== "string" || typeof raw.email !== "string") {
      return { ok: false, code: "invalid_profile" }
    }
    if (raw.email_verified !== true) {
      return { ok: false, code: "email_not_verified" }
    }

    return {
      ok: true,
      identity: {
        googleSub: raw.sub,
        email: raw.email.toLowerCase(),
        isVerified: true,
        name: typeof raw.name === "string" ? raw.name : null,
      },
    }
  }
}

const googleProfile = new GoogleProfile()

export default googleProfile
