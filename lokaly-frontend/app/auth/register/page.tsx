'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { register } from '@/lib/auth'

const REGIONS = ['Dakar','Saint-Louis','Thiès','Kaolack','Ziguinchor','Touba','Louga','Diourbel','Fatick','Kaffrine','Kédougou','Kolda','Matam','Sédhiou','Tambacounda']

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const isVendeur = searchParams.get('role') === 'vendeur'

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', region: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register({ ...form, role: isVendeur ? 'VENDEUR' : 'CLIENT' })
      window.location.href = user.role === 'VENDEUR' ? '/vendeur' : '/'
    } catch { setError('Une erreur est survenue. Vérifiez vos informations.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl border border-[#f0e8d8] shadow-lg p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="font-display text-3xl font-bold text-[#e8720a]">Lokaly</Link>
          <p className="text-sm text-[#8b6030] mt-1">
            {isVendeur ? 'Créer un compte vendeur' : 'Créer votre compte client'}
          </p>
        </div>
        {isVendeur && (
          <div className="bg-[#fff8f0] border border-[#ffd4a8] rounded-xl p-3 text-xs text-[#8b6030]">
            🛒 Votre compte vendeur sera soumis à validation par l'administrateur avant activation.
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Nom complet</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="Votre nom" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Email</label>
            <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="votre@email.com" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Téléphone</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="77 XXX XX XX" className="input-base" maxLength={12} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Région</label>
            <select value={form.region} onChange={e => set('region', e.target.value)} className="input-base">
              <option value="">Sélectionner une région</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Mot de passe</label>
            <input type="password" required value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="Min. 8 caractères" className="input-base" minLength={8} />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? 'Création...' : isVendeur ? 'Créer mon compte vendeur' : 'S\'inscrire'}
          </button>
        </form>
        <p className="text-center text-sm text-[#8b6030]">
          Déjà un compte ?{' '}
          <Link href="/auth/login" className="text-[#e8720a] font-semibold hover:underline">Se connecter</Link>
        </p>
        {!isVendeur && (
          <p className="text-center text-xs text-[#c4a472]">
            Vous êtes artisan ?{' '}
            <Link href="/auth/register?role=vendeur" className="text-[#e8720a] hover:underline">
              Créer un compte vendeur
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
