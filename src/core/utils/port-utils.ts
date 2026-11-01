import * as dotenv from "dotenv"
import { PORT } from "@/core/utils/constants.js"

dotenv.config()

/**
- Parses and validates a port string input into a numeric port value.
- Returns the validated number or false if the port specification is invalid.
 */
const normalizePort = (val: string): number | boolean => {
  const port: number = parseInt(val, 10)
  if (port >= 0) {
    return port
  }
  return false
}

const port = normalizePort(process.env.PORT || PORT)

export default port
