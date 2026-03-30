'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts'
import api from '@/lib/api'
import type { AnalyticsData } from '@/types'

const COLORS = ['#e8720a', '#1a6b3c', '#6554c0', '#0052cc', '#d4a017']

export default function AdminAnalyticsPage() {
  const [data, setData]     = useState<AnalyticsData | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [period, setPeriod] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/admin/analytics/recommendations?period=${period}`),
      api.get('/admin/interactions?limit=20'),
    ]).then(([a, e]) => {
      setData(a.data)
      setEvents(e.data.results || e.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [period])

  const algoData = data ? [
    { name: 'Popular',     ctr: +((data.ctr_by_algorithm?.popular || 0) * 100).toFixed(2) },
    { name: 'Content',     ctr: +((data.ctr_by_algorithm?.content || 0) * 100).toFixed(2) },
    { name: 'Hybrid',      ctr: +((data.ctr_by_algorithm?.hybrid || 0) * 100).toFixed(2) },
    { name: 'Association', ctr: +((data.ctr_by_algorithm?.association || 0) * 100).toFixed(2) },
    { name: 'KNN',         ctr: +((data.ctr_by_algorithm?.knn || 0) * 100).toFixed(2) },
  ] : []

  const blockData = data ? [
    { name: 'Accueil',       ctr: +((data.ctr_by_block?.home || 0) * 100).toFixed(2) },
    { name: 'Fiche Produit', ctr: +((data.ctr_by_block?.product_detail || 0) * 100).toFixed(2) },
    { name: 'Panier',        ctr: +((data.ctr_by_block?.cart || 0) * 100).toFixed(2) },
  ] : []

  const pieData = data ? [
    { name: 'CTR Global',           value: +((data.ctr_global || 0) * 100).toFixed(2) },
    { name: 'Add-to-cart rate',     value: +((data.add_to_cart_rate || 0) * 100).toFixed(2) },
    { name: 'Conversion assistée',  value: +((data.assisted_conversion || 0) * 100).toFixed(2) },
  ] : []

  const Metric = ({ label, value, sub, color }: any) => (
    <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
      <p className="text-xs text-[#8b6030] font-semibold mb-2">{label}</p>
      <p className="font-display font-bold text-3xl" style={{ color }}>{value}</p>
      <p className="text-xs text-[#c4a472] mt-1">{sub}</p>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-y-auto page-enter">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1208]">Analytics — Recommandations</h1>
            <p className="text-sm text-[#8b6030] mt-0.5">CTR, conversion et performance du moteur de recommandation</p>
          </div>
          <select value={period} onChange={e => setPeriod(e.target.value)} className="input-base py-1.5 text-sm w-44">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
          </select>
        </div>

        {/* KPI row */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Metric label="CTR Global" value={`${((data?.ctr_global || 0) * 100).toFixed(2)}%`} sub="clics / impressions" color="#e8720a" />
            <Metric label="CTR Accueil" value={`${((data?.ctr_by_block?.home || 0) * 100).toFixed(2)}%`} sub="bloc homepage" color="#0052cc" />
            <Metric label="CTR Fiche produit" value={`${((data?.ctr_by_block?.product_detail || 0) * 100).toFixed(2)}%`} sub="bloc produits similaires" color="#6554c0" />
            <Metric label="CTR Panier" value={`${((data?.ctr_by_block?.cart || 0) * 100).toFixed(2)}%`} sub="bloc panier" color="#1a6b3c" />
          </div>
        )}

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* CTR par algorithme */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-1">CTR par algorithme</h2>
            <p className="text-xs text-[#8b6030] mb-4">Comparaison des performances par stratégie</p>
            {loading ? <div className="skeleton h-52 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={algoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b6030' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8b6030' }} unit="%" />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'CTR']} contentStyle={{ borderRadius: 12, border: '1px solid #f0e8d8', fontSize: 12 }} />
                  <Bar dataKey="ctr" radius={[6, 6, 0, 0]}>
                    {algoData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart KPI */}
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-1">Vue globale KPI</h2>
            <p className="text-xs text-[#8b6030] mb-4">CTR · Add-to-cart · Conversion</p>
            {loading ? <div className="skeleton h-52 rounded-xl" /> : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ borderRadius: 12, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {pieData.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                      <span className="text-[#5c4a2a] flex-1">{item.name}</span>
                      <span className="font-bold" style={{ color: COLORS[i] }}>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CTR par bloc */}
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-1">CTR par bloc</h2>
            <p className="text-xs text-[#8b6030] mb-4">Accueil · Fiche produit · Panier</p>
            {loading ? <div className="skeleton h-52 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={blockData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8b6030' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8b6030' }} unit="%" />
                  <Tooltip formatter={(v: any) => [`${v}%`, 'CTR']} contentStyle={{ borderRadius: 12, border: '1px solid #f0e8d8', fontSize: 12 }} />
                  <Bar dataKey="ctr" fill="#6554c0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Top produits cliqués */}
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-4">👆 Top produits cliqués via reco</h2>
            <div className="space-y-3">
              {loading ? Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-9 rounded-xl" />) :
                (data?.top_clicked || []).slice(0, 6).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#c4a472] w-5 flex-shrink-0">#{i + 1}</span>
                    <img src={item.product?.images?.[0]?.url || `https://picsum.photos/seed/${item.product?.id}/32/32`}
                      alt="" className="w-8 h-8 rounded-lg object-cover bg-[#f0e8d8]" />
                    <span className="text-sm text-[#1a1208] flex-1 line-clamp-1">{item.product?.name}</span>
                    <span className="text-xs font-bold text-[#e8720a] bg-[#fff8f0] px-2 py-1 rounded-full flex-shrink-0">
                      {item.clicks} clics
                    </span>
                  </div>
                ))
              }
              {!loading && (!data?.top_clicked || data.top_clicked.length === 0) && (
                <p className="text-sm text-[#c4a472] text-center py-8">Aucune donnée disponible.</p>
              )}
            </div>
          </div>
        </div>

        {/* Derniers événements d'interaction */}
        <div className="bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8d8]">
            <h2 className="font-display font-bold text-lg text-[#1a1208]">Derniers événements trackés</h2>
            <p className="text-xs text-[#8b6030] mt-0.5">Interactions utilisateurs en temps réel</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-[#faf6f0]">
                <tr>
                  {['Timestamp', 'Événement', 'Produit', 'Page source', 'Algorithme', 'Position', 'Session'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-[#8b6030] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8d8]">
                {loading ? Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-2"><div className="skeleton h-6 rounded-lg" /></td></tr>
                )) : events.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-[#8b6030]">Aucun événement enregistré.</td></tr>
                ) : events.map((ev: any, i: number) => (
                  <tr key={i} className="hover:bg-[#faf6f0] transition-colors">
                    <td className="px-4 py-3 font-mono text-[#8b6030] whitespace-nowrap">
                      {new Date(ev.timestamp).toLocaleString('fr-SN', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${ev.event_type?.includes('recommendation') ? 'bg-[#fff8f0] text-[#e8720a]' : 'bg-[#f0e8d8] text-[#5c4a2a]'}`}>
                        {ev.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#3d280f]">{ev.product_id ? `#${ev.product_id}` : '—'}</td>
                    <td className="px-4 py-3 text-[#5c4a2a]">{ev.source_page || '—'}</td>
                    <td className="px-4 py-3"><span className="tag-chip">{ev.source_algorithm || '—'}</span></td>
                    <td className="px-4 py-3 text-center text-[#5c4a2a]">{ev.rank_position ?? '—'}</td>
                    <td className="px-4 py-3 font-mono text-[#c4a472] truncate max-w-24">{ev.session_id?.slice(0, 12) || '—'}…</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
