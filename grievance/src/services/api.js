// Core API client for communicating with the ASP.NET Core Web API backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const getAuthToken = () => {
  return localStorage.getItem('token') || ''
}

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

const buildHeaders = (customHeaders = {}, isFormData = false) => {
  const headers = { ...customHeaders }
  const token = getAuthToken()

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const body = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const errorMsg =
      (isJson && (body?.message || (body?.errors && body.errors.join(', ')))) ||
      response.statusText ||
      `Request failed with status ${response.status}`
    const error = new Error(errorMsg)
    error.status = response.status
    error.data = body
    throw error
  }

  // Handle ASP.NET ApiResponse<T> format
  if (isJson && typeof body === 'object' && body !== null && 'success' in body) {
    return body.data !== undefined ? body.data : body
  }

  return body
}

export async function apiRequest(endpoint, { method = 'GET', body, headers = {}, ...options } = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const config = {
    method,
    headers: buildHeaders(headers, isFormData),
    ...options,
  }

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body)
  }

  const response = await fetch(url, config)
  return handleResponse(response)
}

export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => apiRequest(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options) => apiRequest(endpoint, { method: 'PUT', body, ...options }),
  delete: (endpoint, options) => apiRequest(endpoint, { method: 'DELETE', ...options }),
}

export default api
