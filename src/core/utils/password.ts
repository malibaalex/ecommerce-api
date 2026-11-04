import { randomBytes, argon2 as nativeArgon2 } from "node:crypto"
import { promisify } from "node:util"

const argon2Async = promisify(nativeArgon2)

export class PasswordUtil {
  private dummyHash: Promise<string> | null = null

  /**
   * Hashes a password using native Node.js Argon2id.
   * Outputs a PHC-like formatted string: $argon2id$v=19$m=65536,t=3,p=4$<salt>$<hash>
   */
  async hash(plainTextPassword: string): Promise<string> {
    const salt = randomBytes(16)
    const memory = 19456
    const passes = 2
    const parallelism = 1
    const tagLength = 32

    const derivedKey = await argon2Async("argon2id", {
      message: plainTextPassword,
      nonce: salt,
      memory,
      passes,
      parallelism,
      tagLength,
    })

    const saltBase64 = salt.toString("base64")
    const hashBase64 = (derivedKey as Buffer).toString("base64")

    return `$argon2id$v=19$m=${memory},t=${passes},p=${parallelism}$${saltBase64}$${hashBase64}`
  }

  /**
   * Verifies a plain text password against a stored native hash.
   */
  async verify(
    storedHash: string,
    plainTextPassword: string,
  ): Promise<boolean> {
    try {
      // Parse the stored PHC string format
      const parts = storedHash.split("$")
      if (parts.length !== 6 || parts[1] !== "argon2id") return false

      const paramsPart = parts[3]
      const params: Record<string, number> = {}
      paramsPart.split(",").forEach((p) => {
        const [k, v] = p.split("=")
        params[k] = Number(v)
      })

      const salt = Buffer.from(parts[4], "base64")
      const expectedHash = Buffer.from(parts[5], "base64")

      const derivedKey = await argon2Async("argon2id", {
        message: plainTextPassword,
        nonce: salt,
        memory: params["m"],
        passes: params["t"],
        parallelism: params["p"],
        tagLength: expectedHash.length,
      })

      const { timingSafeEqual } = await import("node:crypto")
      return timingSafeEqual(derivedKey as Buffer, expectedHash)
    } catch {
      return false
    }
  }

  /**
   * Same argument order as verify(): (storedHash, plainText).
   */

  async verifyOrDummy(
    storedHash: string | null | undefined,
    plainTextPassword: string,
  ): Promise<boolean> {
    this.dummyHash ??= this.hash(randomBytes(16).toString("hex"))
    const ok = await this.verify(
      storedHash ?? (await this.dummyHash),
      plainTextPassword,
    )
    return storedHash ? ok : false
  }
}
