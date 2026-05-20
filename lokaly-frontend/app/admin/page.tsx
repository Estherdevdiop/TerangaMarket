'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, Users, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import type { AnalyticsData } from '@/types'

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [pending, setPending]     = useState<any[]>([])
  const [period, setPeriod]       = useState('30d')
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/admin/analytics/recommendations?period=${period}`),
      api.get('/admin/products?status=pending'),
    ]).then(([a, p]) => {
      setAnalytics(a.data)
      setPending(p.data.results || p.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [period])

  const algoData = analytics ? [
    { name: 'Popular',     ctr: +((analytics.ctr_by_algorithm?.popular || 0) * 100).toFixed(2) },
    { name: 'Content',     ctr: +((analytics.ctr_by_algorithm?.content || 0) * 100).toFixed(2) },
    { name: 'Hybrid',      ctr: +((analytics.ctr_by_algorithm?.hybrid || 0) * 100).toFixed(2) },
    { name: 'Association', ctr: +((analytics.ctr_by_algorithm?.association || 0) * 100).toFixed(2) },
    { name: 'KNN',         ctr: +((analytics.ctr_by_algorithm?.knn || 0) * 100).toFixed(2) },
  ] : []

  const blockData = analytics ? [
    { name: 'Accueil',       ctr: +((analytics.ctr_by_block?.home || 0) * 100).toFixed(2) },
    { name: 'Fiche Produit', ctr: +((analytics.ctr_by_block?.product_detail || 0) * 100).toFixed(2) },
    { name: 'Panier',        ctr: +((analytics.ctr_by_block?.cart || 0) * 100).toFixed(2) },
  ] : []

  const KPICard = ({ label, value, sub, color, Icon }: any) => (
    <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <p className="text-xs text-[#8b6030] font-semibold leading-tight">{label}</p>
      </div>
      <p className="font-display font-bold text-2xl text-[#1a1208]">{value}</p>
      <p className="text-xs text-[#c4a472] mt-1">{sub}</p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto page-enter">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1208]">Tableau de bord</h1>
            <p className="text-sm text-[#8b6030] mt-0.5">Vue globale de la plateforme TerangaMarket</p>
          </div>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-base py-1.5 text-sm w-44">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
          </select>
        </div>

        {pending.length > 0 && (
          <div className="bg-[#fff8f0] border border-[#ffd4a8] rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} className="text-[#e8720a] flex-shrink-0" />
            <p className="text-sm text-[#5c4a2a]">
              <strong>{pending.length} produit{pending.length > 1 ? 's' : ''}</strong> en attente de validation.{' '}
              <Link href="/admin/produits?status=pending" className="text-[#e8720a] font-semibold underline">Voir →</Link>
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <KPICard label="CTR Global" value={`${((analytics?.ctr_global || 0) * 100).toFixed(2)}%`} sub="clics / impressions reco" color="#e8720a" Icon={TrendingUp} />
            <KPICard label="Add-to-cart rate" value={`${((analytics?.add_to_cart_rate || 0) * 100).toFixed(2)}%`} sub="après clic recommandation" color="#1a6b3c" Icon={ShoppingBag} />
            <KPICard label="Conversion assistée" value={`${((analytics?.assisted_conversion || 0) * 100).toFixed(2)}%`} sub="commandes via reco" color="#6554c0" Icon={Users} />
            <KPICard label="Produits trackés" value={analytics?.top_recommended?.length || 0} sub="dans les blocs reco" color="#0052cc" Icon={Package} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-1">CTR par algorithme</h2>
            <p className="text-xs text-[#8b6030] mb-4">popular · content · hybrid · association · knn</p>
            {loading ? <div className="skeleton h-52 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={algoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8b6030' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b6030' }} unit="%" />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'CTR']} contentStyle={{ borderRadius: 12, border: '1px solid #f0e8d8', fontSize: 12 }} />
                  <Bar dataKey="ctr" fill="#e8720a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-1">CTR par bloc</h2>
            <p className="text-xs text-[#8b6030] mb-4">Accueil · Fiche produit · Panier</p>
            {loading ? <div className="skeleton h-52 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={blockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8b6030' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#8b6030' }} unit="%" />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'CTR']} contentStyle={{ borderRadius: 12, border: '1px solid #f0e8d8', fontSize: 12 }} />
                  <Bar dataKey="ctr" fill="#1a6b3c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {!loading && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '🔥 Top produits recommandés', items: analytics.top_recommended, valueKey: 'impressions', label: 'impressions' },
              { title: '👆 Top produits cliqués', items: analytics.top_clicked, valueKey: 'clicks', label: 'clics' },
            ].map(({ title, items, valueKey, label }) => (
              <div key={title} className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
                <h2 className="font-display font-bold text-lg text-[#1a1208] mb-4">{title}</h2>
                <div className="space-y-3">
                  {(items || []).slice(0, 5).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#c4a472] w-5 flex-shrink-0">#{i + 1}</span>
                      <img src={item.product?.images?.[0]?.url || `https://picsum.photos/seed/${item.product?.id}/36/36`}
                        alt="" className="w-9 h-9 rounded-xl object-cover bg-[#f0e8d8] flex-shrink-0" />
                      <span className="text-sm text-[#1a1208] flex-1 line-clamp-1">{item.product?.name}</span>
                      <span className="text-xs font-bold text-[#e8720a] bg-[#fff8f0] px-2 py-1 rounded-full">{item[valueKey]} {label}</span>
                    </div>
                  ))}
                  {(!items || items.length === 0) && <p className="text-sm text-[#c4a472] text-center py-6">Aucune donnée.</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
