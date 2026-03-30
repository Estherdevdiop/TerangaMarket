'use client'
import { useState } from 'react'
import Link from 'next/link'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      if      (user.role === 'ADMIN')   window.location.href = '/admin'
      else if (user.role === 'VENDEUR') window.location.href = '/vendeur'
      else                              window.location.href = '/'
    } catch { setError('Email ou mot de passe incorrect.') }
    finally   { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#f0e8d8] shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl font-bold text-[#e8720a]">Lokaly</Link>
          <p className="text-sm text-[#8b6030] mt-1">Connectez-vous à votre compte</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" className="input-base" />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="text-center text-sm text-[#8b6030]">
          Pas encore de compte ?{' '}
          <Link href="/auth/register" className="text-[#e8720a] font-semibold hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
