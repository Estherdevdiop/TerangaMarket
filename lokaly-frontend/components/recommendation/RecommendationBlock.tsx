'use client'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/product/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import type { RecommendationItem } from '@/types'
import api from '@/lib/api'
import { trackImpression } from '@/lib/tracking'

interface Props {
  title: string
  endpoint: string
  context: string
  emptyMessage?: string
  cols?: number
}

export default function RecommendationBlock({ title, endpoint, context, emptyMessage = 'Aucun produit pour le moment.', cols = 4 }: Props) {
  const [items, setItems] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(endpoint)
      .then(r => {
        const data: RecommendationItem[] = r.data
        setItems(data)
        // Track impressions for all items
        data.forEach(item => {
          trackImpression(item.product.id, item.algorithm, item.position, context)
        })
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [endpoint, context])

  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[cols] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <section className="py-2">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl font-bold text-[#1a1208]">{title}</h2>
        <span className="text-xs text-[#c4a472] bg-[#f0e8d8] px-3 py-1 rounded-full">
          {items[0]?.algorithm ? `via ${items[0].algorithm}` : ''}
        </span>
      </div>

      {loading ? (
        <div className={`grid ${gridClass} gap-5`}>
          {Array(cols).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[#8b6030] text-sm py-8 text-center bg-[#faf6f0] rounded-2xl">{emptyMessage}</p>
      ) : (
        <div className={`grid ${gridClass} gap-5`}>
          {items.map(item => (
            <ProductCard
              key={item.product.id}
              product={item.product}
              algorithm={item.algorithm}
              position={item.position}
              context={context}
            />
          ))}
        </div>
      )}
    </section>
  )
}
