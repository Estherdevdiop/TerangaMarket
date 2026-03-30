'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingBag, Eye, TrendingUp, Plus, AlertTriangle } from 'lucide-react'
import api from '@/lib/api'
import type { Product, VendorStats } from '@/types'

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Brouillon',             cls: 'status-draft' },
  pending:   { label: 'En attente validation', cls: 'status-pending' },
  published: { label: 'Publié',                cls: 'status-published' },
  disabled:  { label: 'Désactivé',             cls: 'status-disabled' },
}

export default function VendeurPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats]       = useState<VendorStats | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([api.get('/vendor/products'), api.get('/vendor/stats')])
      .then(([p, s]) => { setProducts(p.data.results || p.data); setStats(s.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'disabled' : 'published'
    await api.patch(`/vendor/products/${id}`, { status: newStatus })
    setProducts(ps => ps.map(p => p.id === id ? { ...p, status: newStatus as any } : p))
  }

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#1a1208] flex-shrink-0 hidden md:flex flex-col p-4 gap-1">
        <div className="mb-6 px-2">
          <span className="font-display text-xl font-bold text-[#e8720a]">Lokaly</span>
          <p className="text-xs text-[#c4a472] mt-0.5">Espace Vendeur</p>
        </div>
        {[
          ['/vendeur', '🏠', 'Tableau de bord'],
          ['/vendeur/produits', '📦', 'Mes produits'],
          ['/vendeur/produits/nouveau', '➕', 'Ajouter un produit'],
          ['/compte/commandes', '🛒', 'Mes commandes'],
          ['/', '🏪', 'Voir la boutique'],
        ].map(([href, icon, label]) => (
          <Link key={href as string} href={href as string} className="sidebar-link">
            <span>{icon}</span><span className="text-sm">{label}</span>
          </Link>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 page-enter">
        <h1 className="font-display text-2xl font-bold text-[#1a1208] mb-6">Tableau de bord vendeur</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />) : stats && [
            { icon: Eye, label: 'Vues', value: stats.total_views, color: '#0052cc' },
            { icon: TrendingUp, label: 'Clics reco', value: stats.total_reco_clicks, color: '#e8720a' },
            { icon: ShoppingBag, label: 'Ajouts panier', value: stats.total_cart_adds, color: '#1a6b3c' },
            { icon: Package, label: 'Ventes', value: stats.total_sales, color: '#6554c0' },
            { icon: AlertTriangle, label: 'Ruptures', value: stats.out_of_stock_count, color: '#b5311a' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#f0e8d8] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '20' }}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xs text-[#8b6030]">{s.label}</p>
                <p className="font-bold text-[#1a1208]">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e8d8]">
            <h2 className="font-display font-bold text-lg text-[#1a1208]">Mes produits</h2>
            <Link href="/vendeur/produits/nouveau" className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <Plus size={14} /> Nouveau produit
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf6f0]">
                <tr>
                  {['Produit','Prix','Stock','Statut','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#8b6030] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8d8]">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="px-5 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>
                  ))
                ) : products.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-[#8b6030]">
                    Aucun produit. <Link href="/vendeur/produits/nouveau" className="text-[#e8720a] underline">Créer votre premier produit</Link>
                  </td></tr>
                ) : products.map(p => {
                  const st = STATUS_MAP[p.status] || { label: p.status, cls: 'status-draft' }
                  return (
                    <tr key={p.id} className="hover:bg-[#faf6f0] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]?.url || `https://picsum.photos/seed/${p.id}/40/40`}
                            alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-[#f0e8d8]" />
                          <span className="font-medium text-[#1a1208] line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold text-[#e8720a]">{p.price.toLocaleString('fr-SN')} FCFA</td>
                      <td className="px-5 py-3">
                        <span className={p.stock === 0 ? 'text-red-500 font-semibold' : 'text-[#3d280f]'}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/vendeur/produits/${p.id}`} className="text-xs text-[#0052cc] hover:underline">Modifier</Link>
                          <button onClick={() => toggleStatus(p.id, p.status)}
                            className="text-xs text-[#8b6030] hover:text-[#e8720a]">
                            {p.status === 'published' ? 'Désactiver' : 'Activer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
