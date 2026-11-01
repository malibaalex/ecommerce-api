import pino from "pino"
import { env } from "./env-utils.js"

/**
- Configures a multi-destination Pino logger with environment-aware log levels and pretty printing.
- Automatically sets up daily log rotation and redacts sensitive headers like authorization and cookies.
 */
const isTest = env.NODE_ENV === "test"
const isDev = env.NODE_ENV === "development"
const level = isTest ? "silent" : isDev ? "debug" : "info"

const targets: pino.TransportTargetOptions[] = [
  // 1) stdout: what Render's log viewer reads
  isDev
    ? { target: "pino-pretty", level, options: { colorize: true } }
    : { target: "pino/file", level, options: { destination: 1 } }, // 1 = stdout

  // 2) file: local backup, rotated daily
  {
    target: "pino-roll",
    level,
    options: {
      file: "./logs/app",
      extension: ".log",
      frequency: "daily",
      dateFormat: "yyyy-MM-dd",
      mkdir: true,
      symlink: true,
      limit: { count: 1 },
    },
  },
]

const logger = pino(
  {
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
      'res.headers["set-cookie"]',
    ],
  },
  isTest ? undefined : pino.transport({ targets }),
)

export default logger
