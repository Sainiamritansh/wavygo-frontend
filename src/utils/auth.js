// ============================================================
// WavyGo — Auth Token Utilities
// ============================================================
// Ready for JWT integration. Backend dev just returns a real
// JWT from login endpoint and everything works automatically.

const TOKEN_KEY = 'wavygo_token'
const USER_KEY = 'wavygo_user'

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const removeToken = () => localStorage.removeItem(TOKEN_KEY)
export const isLoggedIn = () => !!getToken()

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user))
export const getUser = () => {
  const u = localStorage.getItem(USER_KEY)
  return u ? JSON.parse(u) : null
}
export const removeUser = () => localStorage.removeItem(USER_KEY)

