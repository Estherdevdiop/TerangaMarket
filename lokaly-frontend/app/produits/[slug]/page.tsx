'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RecommendationBlock from '@/components/recommendation/RecommendationBlock'
import { ShoppingCart, MapPin, Package, Star, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { track } from '@/lib/tracking'
import type { Product } from '@/types'

export default function ProductDetailPage() {
  const { slug }    = useParams<{ slug: string }>()
  const [product, setProduct]   = useState<Product | null>(null)
  const [loading, setLoading]   = useState(true)
  const [mainImg, setMainImg]   = useState<string>('')
  const [qty, setQty]           = useState(1)
  const [adding, setAdding]     = useState(false)
  const [added, setAdded]       = useState(false)

  useEffect(() => {
    api.get(`/products/${slug}`)
      .then(r => {
        setProduct(r.data)
        const primary = r.data.images?.find((i: any) => i.is_primary) || r.data.images?.[0]
        setMainImg(primary?.url || `https://picsum.photos/seed/${r.data.id}/600/600`)
        track({ event_type: 'product_view', product_id: r.data.id, source_page: 'product_detail' })
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    try {
      await api.post('/cart/items', { product_id: product.id, quantity: qty })
      await track({ event_type: 'add_to_cart', product_id: product.id, source_page: 'product_detail' })
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch {
      alert('Connectez-vous pour ajouter au panier.')
    } finally { setAdding(false) }
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 rounded-xl w-3/4" />
          <div className="skeleton h-5 rounded-xl w-1/2" />
          <div className="skeleton h-10 rounded-xl w-1/3" />
          <div className="skeleton h-24 rounded-xl" />
        </div>
      </div>
    </>
  )

  if (!product) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">😕</p>
        <p className="font-display text-2xl font-bold text-[#1a1208]">Produit introuvable</p>
        <Link href="/produits" className="btn-primary mt-6 inline-block">Retour au catalogue</Link>
      </div>
    </>
  )

  const isAvailable = product.stock > 0 && product.status === 'published'

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 page-enter">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#8b6030] mb-6">
          <Link href="/" className="hover:text-[#e8720a]">Accueil</Link>
          <span>/</span>
          <Link href="/produits" className="hover:text-[#e8720a]">Produits</Link>
          <span>/</span>
          <span className="text-[#3d280f]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden bg-[#f0e8d8]">
              <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map(img => (
                  <button key={img.id} onClick={() => setMainImg(img.url)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${mainImg === img.url ? 'border-[#e8720a]' : 'border-transparent'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              {product.is_local && (
                <span className="bg-[#1a6b3c] text-white text-xs px-3 py-1 rounded-full font-medium mb-2 inline-block">
                  🇸🇳 Produit local
                </span>
              )}
              <h1 className="font-display text-3xl font-bold text-[#1a1208] mt-2">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-[#8b6030]">
                <MapPin size={14} />
                <span>{product.vendor?.boutique_name} · {product.region_origin}</span>
              </div>
            </div>

            <p className="font-display text-3xl font-bold text-[#e8720a]">
              {product.price.toLocaleString('fr-SN')} FCFA
            </p>

            <p className="text-[#3d280f] leading-relaxed text-sm">{product.description}</p>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Matière', product.material],
                ['Couleur', product.color],
                ['Style', product.style],
                ['Technique', product.technique],
                ['Occasion', product.occasion],
                ['Catégorie', product.category?.name],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} className="bg-[#faf6f0] rounded-xl p-3">
                  <p className="text-xs text-[#8b6030] font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-[#1a1208] mt-0.5">{value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="tag-chip">{tag}</span>
                ))}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package size={14} className={isAvailable ? 'text-[#1a6b3c]' : 'text-red-500'} />
              <span className={isAvailable ? 'text-[#1a6b3c] font-medium' : 'text-red-500 font-medium'}>
                {isAvailable ? `En stock (${product.stock} disponible${product.stock > 1 ? 's' : ''})` : 'Épuisé'}
              </span>
            </div>

            {/* Add to cart */}
            {isAvailable && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#ddc9a8] rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-[#3d280f] hover:bg-[#f0e8d8] font-bold">−</button>
                  <span className="px-4 font-semibold text-[#1a1208]">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className="px-4 py-2.5 text-[#3d280f] hover:bg-[#f0e8d8] font-bold">+</button>
                </div>
                <button onClick={handleAddToCart} disabled={adding}
                  className={`flex-1 btn-primary flex items-center justify-center gap-2 py-3 ${added ? 'bg-[#1a6b3c]' : ''}`}>
                  <ShoppingCart size={17} />
                  {added ? '✓ Ajouté !' : adding ? 'Ajout...' : 'Ajouter au panier'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-10">
          <RecommendationBlock
            title="Produits similaires"
            endpoint={`/recommendations/product/${product.id}`}
            context="product_detail"
            cols={4}
            emptyMessage="Aucun produit similaire trouvé."
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
