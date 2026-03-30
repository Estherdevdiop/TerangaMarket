'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CheckCircle2, XCircle, Search } from 'lucide-react'
import api from '@/lib/api'
import type { Product } from '@/types'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Brouillon',   cls: 'status-draft' },
  pending:   { label: 'En attente', cls: 'status-pending' },
  published: { label: 'Publié',     cls: 'status-published' },
  disabled:  { label: 'Désactivé', cls: 'status-disabled' },
}

export default function AdminProduitsPage() {
  const [products, setProducts]       = useState<Product[]>([])
  const [loading, setLoading]         = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch]           = useState('')

  const fetchProducts = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (search)       params.set('q', search)
    api.get(`/admin/products?${params}`)
      .then(r => setProducts(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [filterStatus, search])

  const moderate = async (id: number, status: 'published' | 'disabled') => {
    await api.patch(`/admin/products/${id}/moderate`, { status })
    setProducts(ps => ps.map(p => p.id === id ? { ...p, status } : p))
  }

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 page-enter">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1208]">Gestion des produits</h1>
            <p className="text-sm text-[#8b6030] mt-0.5">Modération et gestion du catalogue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4a472]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit..." className="input-base pl-8 py-2 text-sm w-56" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[['', 'Tous'], ['pending', 'En attente ⚠️'], ['published', 'Publiés'], ['disabled', 'Désactivés'], ['draft', 'Brouillons']].map(([v, l]) => (
              <button key={v} onClick={() => setFilterStatus(v)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${filterStatus === v ? 'bg-[#e8720a] text-white border-[#e8720a]' : 'border-[#ddc9a8] text-[#5c4a2a] hover:border-[#e8720a] bg-white'}`}>
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
                  {['Produit', 'Vendeur', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#8b6030] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8d8]">
                {loading ? Array(6).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="skeleton h-10 rounded-lg" /></td></tr>
                )) : products.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-16 text-[#8b6030]">
                    <p className="text-3xl mb-2">📦</p>
                    <p>Aucun produit dans cette catégorie.</p>
                  </td></tr>
                ) : products.map(p => {
                  const st = STATUS_MAP[p.status] || { label: p.status, cls: 'status-draft' }
                  return (
                    <tr key={p.id} className="hover:bg-[#faf6f0] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]?.url || `https://picsum.photos/seed/${p.id}/40/40`}
                            alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-[#f0e8d8] flex-shrink-0" />
                          <div>
                            <p className="font-medium text-[#1a1208] line-clamp-1 max-w-xs">{p.name}</p>
                            <p className="text-xs text-[#c4a472]">{p.region_origin}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[#5c4a2a] whitespace-nowrap">{p.vendor?.boutique_name || '—'}</td>
                      <td className="px-5 py-3"><span className="tag-chip">{p.category?.name || '—'}</span></td>
                      <td className="px-5 py-3 font-semibold text-[#e8720a] whitespace-nowrap">{p.price?.toLocaleString('fr-SN')} FCFA</td>
                      <td className="px-5 py-3">
                        <span className={p.stock === 0 ? 'text-red-500 font-bold' : 'text-[#3d280f]'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          {p.status === 'pending' && (
                            <>
                              <button onClick={() => moderate(p.id, 'published')}
                                className="flex items-center gap-1 text-xs text-[#1a6b3c] hover:underline font-semibold">
                                <CheckCircle2 size={13} /> Valider
                              </button>
                              <button onClick={() => moderate(p.id, 'disabled')}
                                className="flex items-center gap-1 text-xs text-red-500 hover:underline font-semibold">
                                <XCircle size={13} /> Refuser
                              </button>
                            </>
                          )}
                          {p.status === 'published' && (
                            <button onClick={() => moderate(p.id, 'disabled')} className="text-xs text-[#8b6030] hover:text-red-500 transition-colors">
                              Désactiver
                            </button>
                          )}
                          {(p.status === 'disabled' || p.status === 'draft') && (
                            <button onClick={() => moderate(p.id, 'published')} className="text-xs text-[#1a6b3c] hover:underline font-semibold">
                              Publier
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {products.length > 0 && (
            <div className="px-5 py-3 border-t border-[#f0e8d8] text-xs text-[#8b6030]">
              {products.length} produit{products.length > 1 ? 's' : ''} affiché{products.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
