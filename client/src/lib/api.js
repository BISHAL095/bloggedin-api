export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const readJson = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const fetchPublishedPosts = async () => {
  const response = await fetch(`${API_URL}/posts`)
  return readJson(response)
}

export const fetchPostDetails = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`)
  return readJson(response)
}

export const loginUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}

export const registerUser = async (payload) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}

export const createComment = async (token, payload) => {
  const response = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}
