export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const readJson = async (response) => {
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

export const loginAdmin = async (payload) => {
  const response = await fetch(`${API_URL}/auth/login`, jsonRequest('POST', payload))

  return readJson(response)
}

export const fetchSession = async () => {
  const response = await fetch(`${API_URL}/auth/session`, {
    credentials: 'include',
  })

  return readJson(response)
}

export const logoutAdmin = async (csrfToken) => {
  const response = await fetch(`${API_URL}/auth/logout`, jsonRequest('POST', {}, csrfToken))

  return readJson(response)
}

export const fetchAdminPosts = async () => {
  const response = await fetch(`${API_URL}/posts/admin/all`, {
    credentials: 'include',
  })

  return readJson(response)
}

export const createPost = async (payload, csrfToken) => {
  const response = await fetch(`${API_URL}/posts`, jsonRequest('POST', payload, csrfToken))

  return readJson(response)
}

export const updatePost = async (postId, payload, csrfToken) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, jsonRequest('PUT', payload, csrfToken))

  return readJson(response)
}

export const deletePost = async (postId, csrfToken) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, jsonRequest('DELETE', {}, csrfToken))

  return readJson(response)
}

export const deleteComment = async (commentId, csrfToken) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, jsonRequest('DELETE', {}, csrfToken))

  return readJson(response)
}
