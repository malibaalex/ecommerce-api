export const PORT = "4001"

/**
 * Defines standardized HTTP status code mappings for consistent API responses.
 * Exports matching response messages and a compound response key type.
 */
export const HTTP_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
} as const

export const HTTP_MSG = {
  SUCCESS: "success",
  CREATED: "created successfully",
  BAD_REQUEST: "bad request",
  UNAUTHORIZED: "unauthorized",
  FORBIDDEN: "forbidden",
  NOT_FOUND: "not found",
  METHOD_NOT_ALLOWED: "method not allowed",
  CONFLICT: "conflict",
  TOO_MANY_REQUESTS: "too many requests",
  SERVER_ERROR: "server error",

  WELCOME: "welcome to the API",
  INVALID_ROUTE: "invalid route",
  INVALID_METHOD: "invalid method",
  ALREADY_EXISTS: "already exists",
} as const

export type ResponseKey = keyof typeof HTTP_STATUS & keyof typeof HTTP_MSG
