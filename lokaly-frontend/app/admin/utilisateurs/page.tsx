'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Search, UserCheck, UserX } from 'lucide-react'
import api from '@/lib/api'

const ROLE_UI: Record<string, { label: string; cls: string }> = {
  CLIENT:  { label: 'Client',  cls: 'bg-blue-100 text-blue-800' },
  VENDEUR: { label: 'Vendeur', cls: 'bg-[#fff8f0] text-[#e8720a]' },
  ADMIN:   { label: 'Admin',   cls: 'bg-purple-100 text-purple-800' },
}

export default function AdminUtilisateursPage() {
  const [users, setUsers]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filterRole, setRole] = useState('')

  const fetchUsers = () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (search)     p.set('q', search)
    if (filterRole) p.set('role', filterRole)
    api.get(`/admin/users?${p}`)
      .then(r => setUsers(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [search, filterRole])

  const toggleActive = async (id: number, isActive: boolean) => {
    await api.patch(`/admin/users/${id}`, { is_active: !isActive })
    setUsers(us => us.map(u => u.id === id ? { ...u, is_active: !isActive } : u))
  }

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 page-enter">

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#1a1208]">Utilisateurs</h1>
          <p className="text-sm text-[#8b6030] mt-0.5">Gestion des clients, vendeurs et administrateurs</p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4a472]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou email..." className="input-base pl-8 py-2 text-sm w-64" />
          </div>
          <div className="flex gap-2">
            {[['', 'Tous'], ['CLIENT', 'Clients'], ['VENDEUR', 'Vendeurs'], ['ADMIN', 'Admins']].map(([v, l]) => (
              <button key={v} onClick={() => setRole(v)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${filterRole === v ? 'bg-[#e8720a] text-white border-[#e8720a]' : 'border-[#ddc9a8] text-[#5c4a2a] hover:border-[#e8720a] bg-white'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf6f0] border-b border-[#f0e8d8]">
                <tr>
                  {['Utilisateur', 'Email', 'Téléphone', 'Région', 'Rôle', 'Inscription', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#8b6030] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8d8]">
                {loading ? Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-5 py-3"><div className="skeleton h-10 rounded-lg" /></td></tr>
                )) : users.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-16 text-[#8b6030]">
                    <p className="text-3xl mb-2">👥</p><p>Aucun utilisateur trouvé.</p>
                  </td></tr>
                ) : users.map((u: any) => {
                  const role = ROLE_UI[u.role] || { label: u.role, cls: 'bg-gray-100 text-gray-600' }
                  return (
                    <tr key={u.id} className="hover:bg-[#faf6f0] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#f0e8d8] flex items-center justify-center font-bold text-[#8b6030] text-sm flex-shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#1a1208]">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#5c4a2a]">{u.email}</td>
                      <td className="px-5 py-3 text-[#5c4a2a]">{u.phone || '—'}</td>
                      <td className="px-5 py-3 text-[#5c4a2a]">{u.region || '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.cls}`}>{role.label}</span>
                      </td>
                      <td className="px-5 py-3 text-xs text-[#8b6030] whitespace-nowrap">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-SN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                          {u.is_active !== false ? 'Actif' : 'Suspendu'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleActive(u.id, u.is_active !== false)}
                          className={`flex items-center gap-1 text-xs font-semibold transition-colors ${u.is_active !== false ? 'text-red-400 hover:text-red-600' : 'text-[#1a6b3c] hover:underline'}`}>
                          {u.is_active !== false ? <><UserX size={13} /> Suspendre</> : <><UserCheck size={13} /> Réactiver</>}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {users.length > 0 && (
            <div className="px-5 py-3 border-t border-[#f0e8d8] text-xs text-[#8b6030]">
              {users.length} utilisateur{users.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
