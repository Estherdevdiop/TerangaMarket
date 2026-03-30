'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { SlidersHorizontal, X } from 'lucide-react'
import api from '@/lib/api'
import type { Product } from '@/types'

const MATERIALS = ['Cuir','Tissu Wax','Coton','Raphia','Perles','Métal','Bois']
const STYLES    = ['Traditionnel','Contemporain','Fusion','Minimaliste','Coloré']
const REGIONS   = ['Dakar','Saint-Louis','Thiès','Kaolack','Ziguinchor','Touba','Louga']
const OCCASIONS = ['Quotidien','Cérémonie','Cadeau','Voyage','Mariage']

export default function ProduitsPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    q:          searchParams.get('q') || '',
    categorie:  searchParams.get('categorie') || '',
    prix_min:   searchParams.get('prix_min') || '',
    prix_max:   searchParams.get('prix_max') || '',
    region:     searchParams.get('region') || '',
    material:   searchParams.get('material') || '',
    style:      searchParams.get('style') || '',
    occasion:   searchParams.get('occasion') || '',
    tri:        searchParams.get('tri') || 'popularite',
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v) })
      params.set('page', String(page))
      const res = await api.get(`/products?${params}`)
      setProducts(res.data.results || res.data)
      setTotal(res.data.count || res.data.length || 0)
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }, [filters, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const setFilter = (key: string, value: string) =>
    setFilters(f => ({ ...f, [key]: value }))

  const clearFilters = () =>
    setFilters({ q: '', categorie: '', prix_min: '', prix_max: '', region: '', material: '', style: '', occasion: '', tri: 'popularite' })

  const activeCount = Object.entries(filters).filter(([k, v]) => v && k !== 'tri').length

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 page-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-[#1a1208]">
              {filters.q ? `Résultats pour "${filters.q}"` : filters.categorie ? filters.categorie.replace(/-/g,' ') : 'Tous les produits'}
            </h1>
            <p className="text-sm text-[#8b6030] mt-1">{total} produit{total > 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={filters.tri} onChange={e => setFilter('tri', e.target.value)}
              className="input-base py-2 text-sm w-44">
              <option value="popularite">Popularité</option>
              <option value="nouveaute">Nouveautés</option>
              <option value="prix_asc">Prix croissant</option>
              <option value="prix_desc">Prix décroissant</option>
            </select>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 btn-outline py-2 px-4 text-sm relative">
              <SlidersHorizontal size={15} /> Filtres
              {activeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#e8720a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-56 flex-shrink-0`}>
            <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5 sticky top-24 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1a1208] text-sm">Filtres</span>
                {activeCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-[#e8720a] flex items-center gap-1">
                    <X size={12} /> Effacer
                  </button>
                )}
              </div>

              {/* Prix */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Prix (FCFA)</p>
                <div className="flex gap-2">
                  <input placeholder="Min" value={filters.prix_min} onChange={e => setFilter('prix_min', e.target.value)}
                    className="input-base py-1.5 text-xs" type="number" />
                  <input placeholder="Max" value={filters.prix_max} onChange={e => setFilter('prix_max', e.target.value)}
                    className="input-base py-1.5 text-xs" type="number" />
                </div>
              </div>

              {/* Region */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Région</p>
                <select value={filters.region} onChange={e => setFilter('region', e.target.value)} className="input-base py-1.5 text-xs">
                  <option value="">Toutes</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Matière */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Matière</p>
                <div className="space-y-1">
                  {MATERIALS.map(m => (
                    <label key={m} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="material" value={m} checked={filters.material === m}
                        onChange={e => setFilter('material', e.target.value)}
                        className="accent-[#e8720a]" />
                      <span className="text-xs text-[#3d280f] group-hover:text-[#e8720a]">{m}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="material" value="" checked={!filters.material}
                      onChange={() => setFilter('material', '')} className="accent-[#e8720a]" />
                    <span className="text-xs text-[#8b6030]">Toutes</span>
                  </label>
                </div>
              </div>

              {/* Style */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Style</p>
                <select value={filters.style} onChange={e => setFilter('style', e.target.value)} className="input-base py-1.5 text-xs">
                  <option value="">Tous</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Occasion */}
              <div>
                <p className="text-xs font-semibold text-[#8b6030] uppercase tracking-wider mb-2">Occasion</p>
                <select value={filters.occasion} onChange={e => setFilter('occasion', e.target.value)} className="input-base py-1.5 text-xs">
                  <option value="">Toutes</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#f0e8d8]">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold text-[#1a1208]">Aucun produit trouvé</p>
                <p className="text-sm text-[#8b6030] mt-1">Essayez d'élargir vos filtres</p>
                <button onClick={clearFilters} className="btn-primary mt-4 text-sm py-2 px-5">
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map(p => <ProductCard key={p.id} product={p} context="category" />)}
                </div>
                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && (
                    <button onClick={() => setPage(p => p - 1)} className="btn-outline py-2 px-5 text-sm">← Précédent</button>
                  )}
                  {products.length === 12 && (
                    <button onClick={() => setPage(p => p + 1)} className="btn-primary py-2 px-5 text-sm">Suivant →</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
