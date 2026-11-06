/* eslint-disable no-undef */

import api from "./api.js"

const { routes, storageKeys, request, messageOf, remember, save, load } = api

const $ = (id) => document.getElementById(id)

let pendingPassword = ""
let requiresPasswordSetup = false

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formData = (form) => Object.fromEntries(new FormData(form).entries())

const showMessage = (form, message, isError = false) => {
  const target = form.querySelector(".msg")

  if (!target) return

  target.textContent = message
  target.classList.toggle("error", isError)
}

const setLoading = (button, loading) => {
  if (button) button.disabled = loading
}

const setView = (view) => {
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.hidden = section.dataset.view !== view
  })

  if (location.hash !== `#${view}`) {
    history.replaceState(null, "", `#${view}`)
  }
}

const getView = () => {
  const view = location.hash.replace("#", "")

  return ["signin", "otp", "reset"].includes(view) ? view : "signin"
}

const getSessionId = (inputId, storageKey) => {
  return $(inputId)?.value.trim() || load(storageKey)
}

const storeSessionId = (sessionId, inputId, storageKey) => {
  if (!sessionId) return ""

  save(storageKey, sessionId)

  const input = $(inputId)

  if (input) {
    input.value = sessionId
  }

  return sessionId
}

const updatePasswordSetupField = () => {
  const field = $("first-password-field")
  const input = $("ov-password")

  if (!field || !input) return

  field.hidden = !requiresPasswordSetup
  input.required = requiresPasswordSetup

  input.value = requiresPasswordSetup ? pendingPassword : ""
}

// --------------------------------------------------
// OTP REQUEST
// --------------------------------------------------

const sendOtp = async (email, purpose = "email_verification") => {
  const res = await request(routes.otpSend, {
    method: "POST",
    body: {
      email,
      purpose,
    },
  })

  if (!res.ok) {
    return {
      ok: false,
      message: messageOf(res.data) || "Unable to send the verification code.",
    }
  }

  const sessionId = remember(res.data)

  if (!sessionId) {
    return {
      ok: false,
      message: "The server did not return an OTP session ID.",
    }
  }

  return {
    ok: true,
    sessionId,
    data: res.data,
  }
}

// --------------------------------------------------
// GOOGLE SIGN-IN
// --------------------------------------------------

$("google")?.addEventListener("click", () => {
  window.location.assign(routes.googleStart)
})

// --------------------------------------------------
// EMAIL + PASSWORD SIGN-IN
// --------------------------------------------------

$("form-signin")?.addEventListener("submit", async (event) => {
  event.preventDefault()

  const form = event.currentTarget
  const { email, password } = formData(form)

  showMessage(form, "")

  if (!email || !password) {
    showMessage(form, "Enter your email and password.", true)
    return
  }

  const button = form.querySelector('[type="submit"]')

  setLoading(button, true)

  try {
    const normalizedEmail = email.trim().toLowerCase()

    const res = await request(routes.signInWithPassword, {
      method: "POST",
      body: {
        email: normalizedEmail,
        password,
      },
    })

    if (!res.ok) {
      showMessage(
        form,
        messageOf(res.data) || "Unable to continue with those credentials.",
        true,
      )
      return
    }

    const setupRequired = api.find(res.data, ["requiresPasswordSetup"])

    requiresPasswordSetup = setupRequired === true

    pendingPassword = requiresPasswordSetup ? password : ""

    // Request the verification OTP.
    const otp = await sendOtp(normalizedEmail)

    if (!otp.ok) {
      pendingPassword = ""
      showMessage(form, otp.message, true)
      return
    }

    // Store the new sign-in session.
    storeSessionId(otp.sessionId, "ov-session", storageKeys.signInSession)

    $("ov-email").value = normalizedEmail
    $("o-email").value = normalizedEmail
    $("ov-code").value = ""

    updatePasswordSetupField()

    setView("otp")
  } catch (error) {
    showMessage(form, error.message || "An unexpected error occurred.", true)
  } finally {
    setLoading(button, false)
  }
})

// --------------------------------------------------
// OTP VERIFICATION
// --------------------------------------------------

$("form-otp-verify")?.addEventListener("submit", async (event) => {
  event.preventDefault()

  const form = event.currentTarget
  const { code, password } = formData(form)

  const sessionId = getSessionId("ov-session", storageKeys.signInSession)

  showMessage(form, "")

  if (!sessionId) {
    showMessage(
      form,
      "Your verification session is missing. Request a new code.",
      true,
    )
    return
  }

  if (!/^\d{6}$/.test(code)) {
    showMessage(form, "Enter a valid six-digit verification code.", true)
    return
  }

  if (requiresPasswordSetup && (!password || password.length < 8)) {
    showMessage(
      form,
      "Your new password must contain at least 8 characters.",
      true,
    )
    return
  }

  const button = form.querySelector('[type="submit"]')

  setLoading(button, true)

  try {
    const body = {
      sessionId,
      code,
    }

    // Only send a password when setting up a new password.
    if (requiresPasswordSetup) {
      body.password = password
    }

    const res = await request(routes.otpVerify, {
      method: "POST",
      body,
    })

    if (!res.ok) {
      showMessage(
        form,
        messageOf(res.data) || "The code is invalid or has expired.",
        true,
      )
      return
    }

    remember(res.data)

    pendingPassword = ""
    requiresPasswordSetup = false

    sessionStorage.removeItem(storageKeys.signInSession)

    window.location.assign("/dashboard")
  } catch (error) {
    showMessage(form, error.message || "An unexpected error occurred.", true)
  } finally {
    setLoading(button, false)
  }
})

// --------------------------------------------------
// PASSWORD RESET: REQUEST OTP
// --------------------------------------------------

$("form-reset-send")?.addEventListener("submit", async (event) => {
  event.preventDefault()

  const form = event.currentTarget
  const { email } = formData(form)

  showMessage(form, "")

  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail) {
    showMessage(form, "Enter your email address.", true)
    return
  }

  const button = form.querySelector('[type="submit"]')

  setLoading(button, true)

  try {
    const otp = await sendOtp(normalizedEmail, "password_reset")

    if (!otp.ok) {
      showMessage(form, otp.message, true)
      return
    }

    storeSessionId(otp.sessionId, "r-session", storageKeys.resetSession)

    showMessage(form, "If the account is eligible, a reset code has been sent.")
  } catch (error) {
    showMessage(form, error.message || "Unable to request a reset code.", true)
  } finally {
    setLoading(button, false)
  }
})

// --------------------------------------------------
// PASSWORD RESET: COMPLETE
// --------------------------------------------------

$("form-reset")?.addEventListener("submit", async (event) => {
  event.preventDefault()

  const form = event.currentTarget
  const { code, newPassword } = formData(form)

  const sessionId = getSessionId("r-session", storageKeys.resetSession)

  showMessage(form, "")

  if (!sessionId) {
    showMessage(
      form,
      "Your reset session is missing. Request a new reset code.",
      true,
    )
    return
  }

  if (!/^\d{6}$/.test(code)) {
    showMessage(form, "Enter a valid six-digit reset code.", true)
    return
  }

  if (!newPassword || newPassword.length < 8) {
    showMessage(
      form,
      "Your new password must contain at least 8 characters.",
      true,
    )
    return
  }

  const button = form.querySelector('[type="submit"]')

  setLoading(button, true)

  try {
    const res = await request(routes.resetPassword, {
      method: "POST",
      body: {
        sessionId,
        code,
        newPassword,
      },
    })

    if (!res.ok) {
      showMessage(
        form,
        messageOf(res.data) || "Unable to reset the password.",
        true,
      )
      return
    }

    form.reset()
    $("form-reset-send")?.reset()

    sessionStorage.removeItem(storageKeys.resetSession)

    showMessage(
      form,
      messageOf(res.data) || "Password updated. You can sign in now.",
    )
  } catch (error) {
    showMessage(form, error.message || "Unable to reset the password.", true)
  } finally {
    setLoading(button, false)
  }
})

// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const view = link.getAttribute("href").slice(1)

    if (["signin", "otp", "reset"].includes(view)) {
      setView(view)
    }
  })
})

window.addEventListener("hashchange", () => {
  setView(getView())
})

// --------------------------------------------------
// INITIAL VIEW
// --------------------------------------------------

setView(getView())
