export const TOKEN_KEY = 'bloggedin_admin_token'

export const getStoredToken = () => window.localStorage.getItem(TOKEN_KEY) || ''

export const storeToken = (token) => {
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = () => {
  window.localStorage.removeItem(TOKEN_KEY)
}

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    return JSON.parse(window.atob(payload))
  } catch {
    return null
  }
}
