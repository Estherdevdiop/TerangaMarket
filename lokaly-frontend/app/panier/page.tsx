'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { track } from '@/lib/tracking'
import type { Cart } from '@/types'

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart')
      setCart(res.data)
    } catch { setCart(null) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCart() }, [])

  const updateQty = async (itemId: number, quantity: number) => {
    if (quantity < 1) return removeItem(itemId)
    await api.patch(`/cart/items/${itemId}`, { quantity })
    fetchCart()
  }

  const removeItem = async (itemId: number) => {
    await api.delete(`/cart/items/${itemId}`)
    await track({ event_type: 'remove_from_cart', source_page: 'cart' })
    fetchCart()
  }

  const handleCheckout = () => {
    track({ event_type: 'checkout_started', source_page: 'cart' })
    window.location.href = '/checkout'
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
        {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
      </div>
    </>
  )

  const isEmpty = !cart || cart.items.length === 0

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 page-enter">
        <h1 className="font-display text-3xl font-bold text-[#1a1208] mb-8">Mon panier</h1>

        {isEmpty ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#f0e8d8]">
            <ShoppingBag size={56} className="text-[#ddc9a8] mx-auto mb-4" />
            <p className="font-display text-xl font-bold text-[#1a1208]">Votre panier est vide</p>
            <p className="text-[#8b6030] text-sm mt-1">Découvrez nos produits artisanaux</p>
            <Link href="/produits" className="btn-primary mt-5 inline-block">Explorer le catalogue</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {cart.items.map(item => {
                const img = item.product.images?.find(i => i.is_primary)?.url || `https://picsum.photos/seed/${item.product.id}/120/120`
                return (
                  <div key={item.id} className="flex gap-4 bg-white rounded-2xl border border-[#f0e8d8] p-4">
                    <img src={img} alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-[#f0e8d8]" />
                    <div className="flex-1 min-w-0">
                      <Link href={`/produits/${item.product.slug}`}
                        className="font-semibold text-[#1a1208] hover:text-[#e8720a] transition-colors text-sm leading-snug line-clamp-2">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-[#8b6030] mt-1">{item.product.vendor?.boutique_name}</p>
                      <p className="font-bold text-[#e8720a] text-sm mt-1">
                        {item.product.price.toLocaleString('fr-SN')} FCFA
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(item.id)}
                        className="text-[#c4a472] hover:text-red-500 transition-colors p-1">
                        <Trash2 size={15} />
                      </button>
                      <div className="flex items-center border border-[#ddc9a8] rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 text-sm text-[#3d280f] hover:bg-[#f0e8d8] font-bold">−</button>
                        <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 text-sm text-[#3d280f] hover:bg-[#f0e8d8] font-bold">+</button>
                      </div>
                      <p className="text-xs text-[#8b6030] font-semibold">
                        {(item.product.price * item.quantity).toLocaleString('fr-SN')} FCFA
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5 sticky top-24 space-y-4">
                <h2 className="font-display font-bold text-[#1a1208] text-lg">Récapitulatif</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#5c4a2a]">
                    <span>Sous-total ({cart.items.length} article{cart.items.length > 1 ? 's' : ''})</span>
                    <span>{cart.subtotal?.toLocaleString('fr-SN')} FCFA</span>
                  </div>
                  <div className="flex justify-between text-[#8b6030] text-xs">
                    <span>Frais de livraison</span>
                    <span>Calculés à l'étape suivante</span>
                  </div>
                </div>
                <div className="border-t border-[#f0e8d8] pt-3">
                  <div className="flex justify-between font-bold text-[#1a1208]">
                    <span>Total estimé</span>
                    <span className="text-[#e8720a] font-display text-lg">{cart.subtotal?.toLocaleString('fr-SN')} FCFA</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  Passer la commande <ArrowRight size={16} />
                </button>
                <Link href="/produits" className="block text-center text-sm text-[#e8720a] hover:underline">
                  ← Continuer mes achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
