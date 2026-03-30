'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import api from '@/lib/api'

const MATERIALS  = ['Cuir','Tissu Wax','Coton','Raphia','Perles','Métal','Bois','Plastique recyclé']
const STYLES     = ['Traditionnel','Contemporain','Fusion','Minimaliste','Coloré','Artisanal']
const COLORS     = ['Noir','Marron','Beige','Blanc','Rouge','Bleu','Vert','Jaune','Multicolore']
const OCCASIONS  = ['Quotidien','Cérémonie','Cadeau','Voyage','Mariage','Travail']
const CATEGORIES = ['Sacs artisanaux','Portefeuilles','Ceintures','Chaussures artisanales','Bijoux artisanaux','Accessoires textiles']
const REGIONS    = ['Dakar','Saint-Louis','Thiès','Kaolack','Ziguinchor','Touba','Louga','Diourbel']

export default function NouveauProduitPage() {
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '',
    category: '', region_origin: '', material: '', color: '',
    style: '', technique: '', occasion: '', is_local: true,
    tags: '',
  })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        price:  parseFloat(form.price),
        stock:  parseInt(form.stock),
        tags:   form.tags.split(',').map(t => t.trim()).filter(Boolean),
        status: 'pending',
      }
      await api.post('/vendor/products', payload)
      setSuccess(true)
    } catch { setError('Erreur lors de la création du produit.') }
    finally  { setSaving(false) }
  }

  if (success) return (
    <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#f0e8d8] p-8 text-center space-y-4 max-w-sm">
        <div className="text-5xl">✅</div>
        <h2 className="font-display font-bold text-2xl text-[#1a1208]">Produit soumis !</h2>
        <p className="text-sm text-[#8b6030]">Votre produit est en attente de validation par l'administrateur.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/vendeur" className="btn-outline py-2 px-5 text-sm">Mon espace</Link>
          <button onClick={() => { setSuccess(false); setForm({ name:'',description:'',price:'',stock:'',category:'',region_origin:'',material:'',color:'',style:'',technique:'',occasion:'',is_local:true,tags:'' }) }}
            className="btn-primary py-2 px-5 text-sm">Nouveau produit</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <div className="max-w-2xl mx-auto px-4 py-8 page-enter">
        <Link href="/vendeur" className="flex items-center gap-2 text-sm text-[#8b6030] hover:text-[#e8720a] mb-6">
          <ArrowLeft size={15} /> Retour au tableau de bord
        </Link>
        <h1 className="font-display text-3xl font-bold text-[#1a1208] mb-6">Nouveau produit</h1>

        <div className="bg-[#fff8f0] border border-[#ffd4a8] rounded-xl p-3 mb-6 text-xs text-[#8b6030]">
          📋 Votre produit sera soumis en état <strong>"En attente"</strong> et devra être validé par l'administrateur avant publication.
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#f0e8d8] p-6 space-y-5">

          {/* Informations de base */}
          <section className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#1a1208] pb-2 border-b border-[#f0e8d8]">Informations générales</h2>
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Nom du produit *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="Ex : Sac en cuir tressé — Collection Thiébou" className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Description *</label>
              <textarea required value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Décrivez votre produit : fabrication, histoire, particularités..."
                rows={4} className="input-base resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Prix (FCFA) *</label>
                <input required type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="25000" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Stock *</label>
                <input required type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)}
                  placeholder="10" className="input-base" />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#1a1208] pb-2 border-b border-[#f0e8d8]">Classification</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Catégorie *</label>
                <select required value={form.category} onChange={e => set('category', e.target.value)} className="input-base">
                  <option value="">Choisir...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Région d'origine *</label>
                <select required value={form.region_origin} onChange={e => set('region_origin', e.target.value)} className="input-base">
                  <option value="">Choisir...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Attributs métier (pour la recommandation) */}
          <section className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#1a1208] pb-2 border-b border-[#f0e8d8]">
              Attributs produit <span className="text-xs text-[#e8720a] font-normal">(utilisés pour les recommandations)</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Matière</label>
                <select value={form.material} onChange={e => set('material', e.target.value)} className="input-base">
                  <option value="">Sélectionner</option>
                  {MATERIALS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Couleur principale</label>
                <select value={form.color} onChange={e => set('color', e.target.value)} className="input-base">
                  <option value="">Sélectionner</option>
                  {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Style</label>
                <select value={form.style} onChange={e => set('style', e.target.value)} className="input-base">
                  <option value="">Sélectionner</option>
                  {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Occasion</label>
                <select value={form.occasion} onChange={e => set('occasion', e.target.value)} className="input-base">
                  <option value="">Sélectionner</option>
                  {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Technique de fabrication</label>
              <input value={form.technique} onChange={e => set('technique', e.target.value)}
                placeholder="Ex : Tressage manuel, couture à la main, broderie..." className="input-base" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Tags (max 10, séparés par des virgules)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)}
                placeholder="artisanat, cuir, dakar, cadeau, wax..." className="input-base" />
              <p className="text-xs text-[#c4a472] mt-1">Les tags améliorent la visibilité dans les recommandations.</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_local} onChange={e => set('is_local', e.target.checked)}
                className="w-4 h-4 accent-[#1a6b3c] rounded" />
              <span className="text-sm font-medium text-[#1a1208]">🇸🇳 Produit fabriqué localement au Sénégal</span>
            </label>
          </section>

          {/* Photos placeholder */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-[#1a1208] pb-2 border-b border-[#f0e8d8]">Photos</h2>
            <div className="border-2 border-dashed border-[#ddc9a8] rounded-2xl p-8 text-center">
              <Upload size={32} className="text-[#c4a472] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#5c4a2a]">Glissez vos photos ici</p>
              <p className="text-xs text-[#c4a472] mt-1">Min. 1 photo, max 5 — JPG, PNG (Upload à connecter au backend)</p>
            </div>
          </section>

          {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Link href="/vendeur" className="btn-outline flex-1 py-3 text-center text-sm">Annuler</Link>
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3 disabled:opacity-60">
              {saving ? 'Soumission...' : 'Soumettre le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
