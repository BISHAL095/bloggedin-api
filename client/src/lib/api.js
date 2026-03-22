export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const readJson = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

const jsonRequest = (method, payload, csrfToken) => ({
  method,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
  },
  ...(payload ? { body: JSON.stringify(payload) } : {}),
})

export const fetchPublishedPosts = async () => {
  const response = await fetch(`${API_URL}/posts`, {
    credentials: 'include',
  })
  return readJson(response)
}

export const fetchPostDetails = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    credentials: 'include',
  })
  return readJson(response)
}

export const fetchSession = async () => {
  const response = await fetch(`${API_URL}/auth/session`, {
    credentials: 'include',
  })

  return readJson(response)
}

export const loginUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/login`, jsonRequest('POST', payload))

  return readJson(response)
}

export const registerUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/register`, jsonRequest('POST', payload))

  return readJson(response)
}

export const logoutUser = async (csrfToken) => {
  const response = await fetch(`${API_URL}/auth/logout`, jsonRequest('POST', {}, csrfToken))
  return readJson(response)
}

export const createComment = async (payload, csrfToken) => {
  const response = await fetch(`${API_URL}/comments`, jsonRequest('POST', payload, csrfToken))

  return readJson(response)
}
