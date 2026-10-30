// Core API client for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const getAuthToken = () => localStorage.getItem('token') || ''
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}
export const getStoredUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}
export const setStoredUser = (user) => {
  if (user) localStorage.setItem('user', JSON.stringify(user))
  else localStorage.removeItem('user')
}

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, ...options } = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  const token = getAuthToken()
  const customHeaders = { 'Content-Type': 'application/json', ...headers }
  if (token) customHeaders['Authorization'] = `Bearer ${token}`

  const config = { method, headers: customHeaders, ...options }
  if (body) config.body = JSON.stringify(body)
  const res = await fetch(url, config)
  return res.json()
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
}
export default api
