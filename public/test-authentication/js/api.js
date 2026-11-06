/* eslint-disable no-empty */
/* eslint-disable no-undef */

const routes = {
  signIn: "/api/auth/email/sign-in",
  signInWithPassword: "/api/auth/email/password",

  googleStart: "/api/auth/google/start",

  otpSend: "/api/auth/otp/send",
  otpVerify: "/api/auth/otp/verify",

  resetPassword: "/api/auth/password-reset",
  logout: "/api/auth/logout",
  refresh: "/api/auth/refresh",
  user: "/api/user/get-me",
}

// Store temporary authentication state for this tab.
const storageKeys = {
  signInSession: "signInSessionId",
  resetSession: "resetSessionId",
  userId: "userId",
}

const save = (key, value) => {
  if (value !== undefined && value !== null && value !== "") {
    sessionStorage.setItem(key, String(value))
  }
}

const load = (key) => sessionStorage.getItem(key) || ""

const clear = () => {
  sessionStorage.clear()
}

// Find a property anywhere in a nested response.
const find = (obj, keys) => {
  const queue = [obj]

  while (queue.length) {
    const current = queue.shift()

    if (!current || typeof current !== "object") continue

    for (const key of keys) {
      if (current[key] !== undefined && current[key] !== null) {
        return current[key]
      }
    }

    queue.push(...Object.values(current))
  }

  return undefined
}

const messageOf = (data) => {
  if (typeof data === "string") return data

  const message = find(data, ["message", "error"])

  return typeof message === "string" ? message : ""
}

const remember = (data) => {
  const sessionId = find(data, ["sessionId"])
  const user = find(data, ["user"])

  if (user && typeof user === "object" && user.id) {
    save(storageKeys.userId, user.id)
  }

  return typeof sessionId === "string" ? sessionId : ""
}

// Request log shown at the bottom of each page.
const log = (method, url, status, body, data) => {
  const box = document.getElementById("log-entries")

  if (!box) return

  box.querySelector(".log-empty")?.remove()

  const hidden = body ? { ...body } : undefined

  if (hidden?.password) hidden.password = "••••••••"
  if (hidden?.newPassword) hidden.newPassword = "••••••••"
  if (hidden?.code) hidden.code = "••••••"

  const entry = document.createElement("details")

  entry.className = "entry"

  entry.innerHTML = `
    <summary>
      <span class="pill ${
        status >= 200 && status < 400 ? "ok" : "err"
      }">${status || "ERR"}</span>
      <span>${method}</span>
      <span class="url"></span>
      <span class="time">${new Date().toLocaleTimeString()}</span>
    </summary>
    <pre></pre>
  `

  entry.querySelector(".url").textContent = url

  entry.querySelector("pre").textContent = JSON.stringify(
    {
      request: hidden,
      response: data,
    },
    null,
    2,
  )

  box.prepend(entry)

  if (status === 0 || status >= 400) {
    box.closest("details")?.setAttribute("open", "")
  }
}

document.getElementById("log-clear")?.addEventListener("click", () => {
  const box = document.getElementById("log-entries")

  if (box) {
    box.innerHTML = '<p class="log-empty">Requests will appear here.</p>'
  }
})

// Generic HTTP request.
const request = async (path, options = {}) => {
  const { method = "POST", body, query } = options

  const url = path + (query ? `?${new URLSearchParams(query)}` : "")

  let res

  try {
    res = await fetch(url, {
      method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    const data = {
      message: "Network error: is the server running?",
    }

    log(method, url, 0, body, data)

    return {
      ok: false,
      status: 0,
      data,
    }
  }

  const responseText = await res.text()

  let data = responseText

  try {
    data = responseText ? JSON.parse(responseText) : null
  } catch {}

  log(method, url, res.status, body, data)

  return {
    ok: res.ok,
    status: res.status,
    data,
  }
}

// Authentication endpoints.
const signIn = (body) => request(routes.signIn, { method: "POST", body })

const signInWithPassword = (body) =>
  request(routes.signInWithPassword, { method: "POST", body })

const sendOtp = (body) => request(routes.otpSend, { method: "POST", body })

const verifyOtp = (body) => request(routes.otpVerify, { method: "POST", body })

const resetPassword = (body) =>
  request(routes.resetPassword, { method: "POST", body })

// Session endpoints: explicitly GET.
const refresh = () => request(routes.refresh, { method: "GET" })

const logout = () => request(routes.logout, { method: "GET" })

const getMe = (query) => request(routes.user, { method: "GET", query })

const api = {
  routes,
  storageKeys,

  request,

  signIn,
  signInWithPassword,
  sendOtp,
  verifyOtp,
  resetPassword,

  refresh,
  logout,
  getMe,

  find,
  messageOf,
  remember,
  save,
  load,
  clear,
}

export default api
