'use client'
// Lightweight admin auth — localStorage token gate
// Replace with real JWT/session auth for production

const ADMIN_TOKEN_KEY = 'ihs_admin_token'
const DEMO_USER = 'admin'
const DEMO_PASS = 'insite2024'

export function login(username, password) {
  if (username === DEMO_USER && password === DEMO_PASS) {
    const token = btoa(`${username}:${Date.now()}`)
    localStorage.setItem(ADMIN_TOKEN_KEY, token)
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAuthenticated() {
  return !!localStorage.getItem(ADMIN_TOKEN_KEY)
}
