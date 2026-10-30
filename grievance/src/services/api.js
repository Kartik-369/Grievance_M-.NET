// Core API client for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, ...options } = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  const config = { method, headers: { 'Content-Type': 'application/json', ...headers }, ...options }
  if (body) config.body = JSON.stringify(body)
  const res = await fetch(url, config)
  return res.json()
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
}
export default api
