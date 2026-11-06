/* eslint-disable no-undef */
import api from "./api.js"

const { getMe, refresh, logout, find, messageOf, load, clear } = api

const $ = (id) => document.getElementById(id)

// Image if there is one, otherwise the initials.
const avatar = (url, label) => {
  const initials = () => {
    const el = document.createElement("span")
    el.className = "avatar"
    el.textContent =
      label
        .split(/[\s@._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("") || "?"

    return el
  }

  if (!url) return initials()

  const img = document.createElement("img")
  img.className = "avatar"
  img.src = url
  img.alt = ""
  img.referrerPolicy = "no-referrer"

  img.addEventListener("error", () => img.replaceWith(initials()))

  return img
}

const render = (data) => {
  const found = find(data, ["user"])

  const user =
    found && typeof found === "object" ? found : (data?.data ?? data ?? {})

  const name =
    user.name ||
    user.fullName ||
    user.username ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unnamed user"

  const picture =
    user.avatar || user.avatarUrl || user.picture || user.image || ""

  $("avatar-slot").replaceChildren(avatar(picture, name))
  $("topbar-avatar").replaceChildren(avatar(picture, name))

  $("name").textContent = name
  $("email").textContent = user.email || ""
  $("uid").textContent = user.id ? `ID ${user.id}` : ""
  $("raw").textContent = JSON.stringify(data, null, 2)
}

const loadUser = async (retry = true) => {
  const id = load("userId")

  let res = await getMe(id ? { id } : undefined)

  // Access token expired: refresh once, then retry.
  if (res.status === 401 && retry) {
    const refreshed = await refresh()

    if (refreshed.ok) {
      return loadUser(false)
    }
  }

  // Keep the page visible when the request fails.
  if (!res.ok) {
    const unauthorized = res.status === 401

    $("name").textContent = unauthorized
      ? "Not signed in"
      : "Could not load profile"

    $("email").textContent =
      messageOf(res.data) || `Request failed (${res.status})`

    const link = document.createElement("a")
    link.href = "/login"
    link.textContent = "Back to login"

    $("uid").replaceChildren(unauthorized ? link : "")

    return
  }

  render(res.data)
}

// Reload profile.
$("reload").addEventListener("click", () => loadUser())

// Manually refresh access token.
$("refresh").addEventListener("click", async () => {
  const res = await refresh()

  $("refresh-status").textContent = res.ok
    ? "Token refreshed"
    : messageOf(res.data) || `Refresh failed (${res.status})`
})

// Logout.
$("logout").addEventListener("click", async () => {
  await logout()

  clear()
  location.href = "/login"
})

// Initial profile load.
loadUser()
