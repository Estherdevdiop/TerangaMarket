import axios from 'axios'
import type { AxiosRequestHeaders } from 'axios'
import Cookies from 'js-cookie'

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    const headers = (config.headers || {}) as AxiosRequestHeaders
    headers.Authorization = `Bearer ${token}`
    config.headers = headers
  }
  return config
})

// Auto-redirect on 401 (but not on auth pages to show error messages)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const isAuthPage = window.location.pathname.startsWith('/auth/')
      if (!isAuthPage) {
        Cookies.remove('access_token')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
