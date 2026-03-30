'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import api from '@/lib/api'
import type { Order } from '@/types'
import Link from 'next/link'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  en_attente:        { label: 'En attente',         color: 'bg-yellow-100 text-yellow-800' },
  paiement_en_cours: { label: 'Paiement en cours',  color: 'bg-blue-100 text-blue-800' },
  payee:             { label: 'Payée',               color: 'bg-green-100 text-green-800' },
  livree:            { label: 'Livrée',              color: 'bg-emerald-100 text-emerald-800' },
  annulee:           { label: 'Annulée',             color: 'bg-gray-100 text-gray-700' },
  echec_paiement:    { label: 'Échec paiement',      color: 'bg-red-100 text-red-700' },
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10 page-enter">
        <h1 className="font-display text-3xl font-bold text-[#1a1208] mb-8">Mes commandes</h1>
        {loading ? (
          <div className="space-y-4">{Array(3).fill(0).map((_,i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#f0e8d8]">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-display font-bold text-xl">Aucune commande</p>
            <Link href="/produits" className="btn-primary mt-4 inline-block">Commencer mes achats</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const st = STATUS_LABELS[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-700' }
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-[#f0e8d8] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[#1a1208]">Commande #{order.id}</p>
                      <p className="text-xs text-[#8b6030]">{new Date(order.created_at).toLocaleDateString('fr-SN', { day:'numeric', month:'long', year:'numeric' })}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {order.items.slice(0,4).map(item => (
                      <img key={item.id} src={item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.id}/60/60`}
                        alt={item.product.name} className="w-12 h-12 rounded-xl object-cover bg-[#f0e8d8]" />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-xl bg-[#f0e8d8] flex items-center justify-center text-xs text-[#8b6030] font-semibold">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#5c4a2a]">
                      {order.delivery_zone?.name} · {order.payment_type === 'livraison' ? 'Paiement à la livraison' : order.payment_type}
                    </div>
                    <p className="font-bold text-[#e8720a] font-display">{order.total?.toLocaleString('fr-SN')} FCFA</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
