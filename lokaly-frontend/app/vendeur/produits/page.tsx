'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/lib/api'
import type { Product } from '@/types'

export default function VendeurProduitsPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    api.get('/vendor/products').then((r) => setProducts(r.data.results || [])).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-6xl mx-auto px-4 py-8 page-enter">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#1a1208]">Mes produits</h1>
            <p className="text-sm text-[#8b6030] mt-1">Catalogue vendeur</p>
          </div>
          <Link href="/vendeur/produits/nouveau" className="btn-primary py-3 px-5 text-sm">Ajouter un produit</Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#f0e8d8] divide-y divide-[#f0e8d8]">
          {products.length === 0 ? (
            <div className="p-10 text-center text-[#8b6030]">Aucun produit pour le moment.</div>
          ) : products.map((product) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <img src={product.images?.[0]?.url} alt={product.name} className="w-16 h-16 rounded-xl object-cover bg-[#f0e8d8]" />
              <div className="flex-1">
                <p className="font-semibold text-[#1a1208]">{product.name}</p>
                <p className="text-sm text-[#8b6030]">{product.price.toLocaleString('fr-SN')} FCFA · stock {product.stock}</p>
              </div>
              <Link href={`/vendeur/produits/${product.id}`} className="text-sm text-[#0052cc] hover:underline">Modifier</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
