'use client'
import Link from 'next/link'
import { ShoppingCart, MapPin } from 'lucide-react'
import type { Product } from '@/types'
import { track } from '@/lib/tracking'
import api from '@/lib/api'

interface Props {
  product: Product
  algorithm?: string
  position?: number
  context?: string
  onAddToCart?: () => void
}

export default function ProductCard({ product, algorithm = 'none', position = 0, context = 'catalog', onAddToCart }: Props) {
  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0]
  const imageUrl = primaryImage?.url || `https://picsum.photos/seed/${product.id}/400/400`

  const handleClick = () => {
    if (algorithm !== 'none') {
      import('@/lib/tracking').then(({ trackClick }) =>
        trackClick(product.id, algorithm, position, context)
      )
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.post('/cart/items', { product_id: product.id, quantity: 1 })
      await track({ event_type: 'add_to_cart', product_id: product.id, source_page: context })
      if (algorithm !== 'none') {
        await track({ event_type: 'recommendation_add_to_cart', product_id: product.id, source_algorithm: algorithm, rank_position: position })
      }
      onAddToCart?.()
      alert('Produit ajouté au panier !')
    } catch {
      alert('Connectez-vous pour ajouter au panier.')
    }
  }

  const isAvailable = product.stock > 0 && product.status === 'published'

  return (
    <Link href={`/produits/${product.slug}`} onClick={handleClick}
      className="card-hover block bg-white rounded-2xl overflow-hidden border border-[#f0e8d8] group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f0e8d8]">
        <img src={imageUrl} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-[#3d280f] text-xs font-semibold px-3 py-1 rounded-full">Épuisé</span>
          </div>
        )}
        {product.is_local && (
          <span className="absolute top-2 left-2 bg-[#1a6b3c] text-white text-xs px-2 py-1 rounded-full font-medium">
            🇸🇳 Local
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[#1a1208] text-sm leading-snug line-clamp-2 group-hover:text-[#e8720a] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-[#8b6030] mb-2">
          <MapPin size={11} /> {product.vendor?.boutique_name || 'Artisan'} · {product.region_origin}
        </div>

        {product.material && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="tag-chip">{product.material}</span>
            {product.style && <span className="tag-chip">{product.style}</span>}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-[#e8720a] text-lg">
            {product.price.toLocaleString('fr-SN')} FCFA
          </span>
          {isAvailable && (
            <button onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-[#e8720a] text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#c45c00] transition-colors">
              <ShoppingCart size={13} /> Ajouter
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}
