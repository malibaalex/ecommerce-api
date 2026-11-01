import "dotenv/config"
import z from "zod"

/**
 - Defines and validates the structure of required environment variables.
 - Ensures runtime safety, type checking, and default fallbacks for server config.
 */
const envSchema = z.object({
  // Google OAuth / OIDC
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.url(),
  APP_URL: z.url(),

  // Server
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4001),

  // Database
  POSTGRES_USER: z.string().min(1, "POSTGRES_USER is required"),
  POSTGRES_PASSWORD: z.string().min(1, "POSTGRES_PASSWORD is required"),
  POSTGRES_DB: z.string().min(1, "POSTGRES_DB is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_ACCESS_SECRET_KEY: z.string().min(1, "JWT_ACCESS_SECRET_KEY is required"),
  JWT_ACCESS_SECRET_KEY_EXPIRES_IN: z.coerce.number().default(900),
  JWT_REFRESH_SECRET_KEY: z
    .string()
    .min(1, "JWT_REFRESH_SECRET_KEY is required"),
  JWT_REFRESH_SECRET_KEY_EXPIRES_IN: z.coerce.number().default(604800),

  // Cookie
  COOKIE_SECRET: z.string().min(1, "COOKIE_SECRET is required"),
})

/**
 - Safely parses process.env against the Zod schema without throwing immediately.
 - Logs structured validation errors and terminates startup if variables are invalid.
 */
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  )
  throw new Error("Invalid environment variables")
}

/**
 - Exports the validated and strictly typed environment object.
 - Provides type-safe access configuration across the entire backend application.
 */
export const env = parsed.data

export type Env = typeof env
