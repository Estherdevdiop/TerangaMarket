'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import type { Product } from '@/types'

export default function EditProduitPage() {
  const params = useParams()
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!productId) return
    api.get('/vendor/products').then((r) => {
      const found = (r.data.results || []).find((item: Product) => String(item.id) === productId)
      if (found) {
        setProduct(found)
        setStatus(found.status)
      }
    }).catch(() => {})
  }, [productId])

  const save = async () => {
    if (!product) return
    setSaving(true)
    try {
      await api.patch(`/vendor/products/${product.id}`, { status })
      router.push('/vendeur')
    } finally {
      setSaving(false)
    }
  }

  if (!product) {
    return <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center text-[#8b6030]">Chargement du produit...</div>
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-2xl mx-auto px-4 py-8 page-enter">
        <Link href="/vendeur" className="text-sm text-[#8b6030] hover:text-[#e8720a]">← Retour vendeur</Link>
        <div className="bg-white rounded-2xl border border-[#f0e8d8] p-6 mt-4">
          <h1 className="font-display text-2xl font-bold text-[#1a1208] mb-2">{product.name}</h1>
          <p className="text-sm text-[#8b6030] mb-6">Édition rapide du statut de publication.</p>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-base mb-4">
            <option value="draft">Brouillon</option>
            <option value="pending">En attente</option>
            <option value="published">Publié</option>
            <option value="disabled">Désactivé</option>
          </select>
          <button onClick={save} disabled={saving} className="btn-primary py-3 px-5 text-sm disabled:opacity-60">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
