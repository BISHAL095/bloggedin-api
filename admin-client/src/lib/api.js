export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const readJson = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const loginAdmin = async (payload) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}

export const fetchAdminPosts = async (token) => {
  const response = await fetch(`${API_URL}/posts/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return readJson(response)
}

export const createPost = async (token, payload) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}

export const updatePost = async (token, postId, payload) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  return readJson(response)
}

export const deletePost = async (token, postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return readJson(response)
}

export const deleteComment = async (token, commentId) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return readJson(response)
}
