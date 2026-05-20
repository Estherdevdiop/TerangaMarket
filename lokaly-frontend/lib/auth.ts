import Cookies from 'js-cookie'
import api from './api'

export interface User {
  id: number
  name: string
  email: string
  role: 'CLIENT' | 'VENDEUR' | 'ADMIN'
  phone?: string
  region?: string
}

function getErrorMessage(err: any): string {
  if (err.response?.data?.detail) return err.response.data.detail
  if (err.response?.data?.email?.[0]) return err.response.data.email[0]
  if (err.response?.data?.password?.[0]) return err.response.data.password[0]
  if (err.message) return err.message
  return 'Une erreur est survenue.'
}

export async function login(email: string, password: string): Promise<User> {
  try {
    const res = await api.post('/auth/login', { email, password })
    Cookies.set('access_token', res.data.access, { expires: 7 })
    return res.data.user
  } catch (err: any) {
    throw new Error(getErrorMessage(err))
  }
}

export async function register(data: {
  name: string; email: string; password: string; phone?: string; region?: string; role?: 'CLIENT' | 'VENDEUR'
}): Promise<User> {
  try {
    const res = await api.post('/auth/register', data)
    Cookies.set('access_token', res.data.access, { expires: 7 })
    return res.data.user
  } catch (err: any) {
    throw new Error(getErrorMessage(err))
  }
}

export async function logout() {
  try { await api.post('/auth/logout') } catch { /* ignore */ }
  Cookies.remove('access_token')
  window.location.href = '/'
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await api.get('/me')
    return res.data
  } catch { return null }
}

export function isLoggedIn(): boolean {
  return !!Cookies.get('access_token')
}
