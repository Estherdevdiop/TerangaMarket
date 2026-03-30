'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import api from '@/lib/api'
import type { Order } from '@/types'

const STATUTS = [
  ['', 'Toutes'],
  ['en_attente', 'En attente'],
  ['paiement_en_cours', 'Paiement en cours'],
  ['payee', 'Payées'],
  ['livree', 'Livrées'],
  ['annulee', 'Annulées'],
  ['echec_paiement', 'Échec paiement'],
]

const STATUS_UI: Record<string, { label: string; cls: string }> = {
  en_attente:        { label: 'En attente',        cls: 'bg-yellow-100 text-yellow-800' },
  paiement_en_cours: { label: 'Paiement en cours', cls: 'bg-blue-100 text-blue-800' },
  payee:             { label: 'Payée',              cls: 'bg-green-100 text-green-800' },
  livree:            { label: 'Livrée',             cls: 'bg-emerald-100 text-emerald-800' },
  annulee:           { label: 'Annulée',            cls: 'bg-gray-100 text-gray-600' },
  echec_paiement:    { label: 'Échec paiement',     cls: 'bg-red-100 text-red-700' },
}

const PAYMENT_LABEL: Record<string, string> = {
  wave: '🌊 Wave',
  orange_money: '🟠 Orange Money',
  livraison: '🚚 À la livraison',
}

export default function AdminCommandesPage() {
  const [orders, setOrders]       = useState<Order[]>([])
  const [loading, setLoading]     = useState(true)
  const [filterStatus, setFilter] = useState('')
  const [selected, setSelected]   = useState<Order | null>(null)

  const fetchOrders = () => {
    setLoading(true)
    const params = filterStatus ? `?status=${filterStatus}` : ''
    api.get(`/admin/orders${params}`)
      .then(r => setOrders(r.data.results || r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filterStatus])

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/admin/orders/${id}/status`, { status })
    setOrders(os => os.map(o => o.id === id ? { ...o, status: status as any } : o))
    if (selected?.id === id) setSelected(s => s ? { ...s, status: status as any } : null)
  }

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 page-enter">

        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-[#1a1208]">Gestion des commandes</h1>
          <p className="text-sm text-[#8b6030] mt-0.5">Toutes les commandes de la plateforme</p>
        </div>

        {/* Filtres statut */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUTS.map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${filterStatus === v ? 'bg-[#e8720a] text-white border-[#e8720a]' : 'border-[#ddc9a8] text-[#5c4a2a] hover:border-[#e8720a] bg-white'}`}>
              {l}
            </button>
          ))}
        </div>

        <div className="flex gap-5">
          {/* Table */}
          <div className="flex-1 bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#faf6f0] border-b border-[#f0e8d8]">
                  <tr>
                    {['#', 'Client', 'Date', 'Zone', 'Paiement', 'Total', 'Statut', 'Action'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#8b6030] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8d8]">
                  {loading ? Array(6).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="skeleton h-8 rounded-lg" /></td></tr>
                  )) : orders.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-16 text-[#8b6030]">
                      <p className="text-3xl mb-2">🛒</p><p>Aucune commande trouvée.</p>
                    </td></tr>
                  ) : orders.map(o => {
                    const st = STATUS_UI[o.status] || { label: o.status, cls: 'bg-gray-100 text-gray-600' }
                    return (
                      <tr key={o.id}
                        onClick={() => setSelected(o)}
                        className={`hover:bg-[#faf6f0] transition-colors cursor-pointer ${selected?.id === o.id ? 'bg-[#fff8f0]' : ''}`}>
                        <td className="px-4 py-3 font-mono text-xs text-[#8b6030]">#{o.id}</td>
                        <td className="px-4 py-3 font-medium text-[#1a1208] whitespace-nowrap">—</td>
                        <td className="px-4 py-3 text-[#5c4a2a] whitespace-nowrap text-xs">
                          {new Date(o.created_at).toLocaleDateString('fr-SN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#5c4a2a] whitespace-nowrap">{o.delivery_zone?.name || '—'}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap">{PAYMENT_LABEL[o.payment_type] || o.payment_type}</td>
                        <td className="px-4 py-3 font-bold text-[#e8720a] whitespace-nowrap">{o.total?.toLocaleString('fr-SN')} FCFA</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${st.cls}`}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={o.status}
                            onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value) }}
                            onClick={e => e.stopPropagation()}
                            className="text-xs border border-[#ddc9a8] rounded-lg px-2 py-1 bg-white text-[#3d280f] cursor-pointer">
                            {STATUTS.filter(([v]) => v).map(([v, l]) => (
                              <option key={v} value={v}>{l}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-[#f0e8d8] p-5 space-y-4 self-start sticky top-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-[#1a1208]">Commande #{selected.id}</h2>
                <button onClick={() => setSelected(null)} className="text-[#c4a472] hover:text-[#3d280f] text-lg">×</button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8b6030]">Date</span>
                  <span>{new Date(selected.created_at).toLocaleDateString('fr-SN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b6030]">Zone</span>
                  <span>{selected.delivery_zone?.name || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b6030]">Paiement</span>
                  <span>{PAYMENT_LABEL[selected.payment_type] || selected.payment_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8b6030]">Livraison</span>
                  <span>{selected.shipping_cost?.toLocaleString('fr-SN')} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-[#1a1208] border-t border-[#f0e8d8] pt-2">
                  <span>Total</span>
                  <span className="text-[#e8720a]">{selected.total?.toLocaleString('fr-SN')} FCFA</span>
                </div>
              </div>

              {/* Articles */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Articles</p>
                <div className="space-y-2">
                  {(selected.items || []).map(item => (
                    <div key={item.id} className="flex items-center gap-2">
                      <img src={item.product?.images?.[0]?.url || `https://picsum.photos/seed/${item.product?.id}/32/32`}
                        alt="" className="w-8 h-8 rounded-lg object-cover bg-[#f0e8d8]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1a1208] line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-[#c4a472]">×{item.quantity} · {item.unit_price?.toLocaleString('fr-SN')} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Changer statut */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Changer le statut</p>
                <select value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="input-base text-sm py-2">
                  {STATUTS.filter(([v]) => v).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
