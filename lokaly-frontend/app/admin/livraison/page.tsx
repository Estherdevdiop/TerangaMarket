'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'
import api from '@/lib/api'
import type { DeliveryZone } from '@/types'

const DEFAULT_ZONES = [
  { code: 'zone1', name: 'Dakar Plateau',  description: 'Centre-ville de Dakar', delay_label: '24h – 48h' },
  { code: 'zone2', name: 'Dakar Banlieue', description: 'Pikine, Guédiawaye, Rufisque…', delay_label: '48h – 72h' },
  { code: 'zone3', name: 'Régions',        description: 'Saint-Louis, Thiès, Kaolack…', delay_label: '3 – 5 jours' },
  { code: 'zone4', name: 'Retrait sur place', description: 'À récupérer chez le vendeur', delay_label: 'Selon vendeur' },
]

export default function AdminLivraisonPage() {
  const [zones, setZones]     = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<DeliveryZone | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', description: '', base_cost: '', delay_label: '' })

  const fetchZones = () => {
    api.get('/delivery-zones')
      .then(r => setZones(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }
  useEffect(() => { fetchZones() }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ code: '', name: '', description: '', base_cost: '', delay_label: '' })
    setShowForm(true)
  }

  const openEdit = (z: DeliveryZone) => {
    setEditing(z)
    setForm({ code: z.code, name: z.name, description: (z as any).description || '', base_cost: String(z.base_cost), delay_label: z.delay_label })
    setShowForm(true)
  }

  const handleSave = async () => {
    const payload = { ...form, base_cost: parseFloat(form.base_cost) || 0 }
    if (editing) {
      await api.patch(`/admin/delivery-zones/${editing.id}`, payload)
    } else {
      await api.post('/admin/delivery-zones', payload)
    }
    setShowForm(false); setEditing(null)
    fetchZones()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Supprimer cette zone de livraison ?')) {
      await api.delete(`/admin/delivery-zones/${id}`)
      fetchZones()
    }
  }

  const setF = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="flex min-h-screen bg-[#faf6f0]">
      <AdminSidebar />
      <main className="flex-1 p-6 page-enter">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1a1208]">Zones de livraison</h1>
            <p className="text-sm text-[#8b6030] mt-0.5">Gérer les zones et les tarifs de livraison</p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2 px-4">
            <Plus size={14} /> Nouvelle zone
          </button>
        </div>

        {/* Info box zones par défaut */}
        <div className="bg-[#faf6f0] border border-[#f0e8d8] rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-[#8b6030] mb-3 uppercase tracking-wider">Zones recommandées par le CDC</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DEFAULT_ZONES.map(dz => (
              <div key={dz.code} className="bg-white rounded-xl border border-[#f0e8d8] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={12} className="text-[#e8720a]" />
                  <span className="text-xs font-bold text-[#1a1208]">{dz.name}</span>
                </div>
                <p className="text-xs text-[#8b6030]">{dz.description}</p>
                <p className="text-xs text-[#c4a472] mt-1">⏱ {dz.delay_label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form modal */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-5 mb-6 shadow-sm">
            <h2 className="font-display font-bold text-lg text-[#1a1208] mb-4">
              {editing ? `Modifier — ${editing.name}` : 'Nouvelle zone de livraison'}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Code</label>
                <input value={form.code} onChange={e => setF('code', e.target.value)}
                  placeholder="zone1" className="input-base font-mono" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Nom affiché</label>
                <input value={form.name} onChange={e => setF('name', e.target.value)}
                  placeholder="Dakar Plateau" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Coût de livraison (FCFA)</label>
                <input type="number" min="0" value={form.base_cost} onChange={e => setF('base_cost', e.target.value)}
                  placeholder="1500" className="input-base" />
                <p className="text-xs text-[#c4a472] mt-1">Saisir 0 pour la livraison gratuite</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Délai indicatif</label>
                <input value={form.delay_label} onChange={e => setF('delay_label', e.target.value)}
                  placeholder="24h – 48h" className="input-base" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-[#1a1208] mb-1.5">Description</label>
                <input value={form.description} onChange={e => setF('description', e.target.value)}
                  placeholder="Ex : Couvre Dakar Plateau et Almadies" className="input-base" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowForm(false)} className="btn-outline text-sm py-2 px-5">Annuler</button>
              <button onClick={handleSave} className="btn-primary text-sm py-2 px-5">
                {editing ? 'Enregistrer les modifications' : 'Créer la zone'}
              </button>
            </div>
          </div>
        )}

        {/* Zones table */}
        <div className="bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#faf6f0] border-b border-[#f0e8d8]">
                <tr>
                  {['Code', 'Zone', 'Description', 'Coût livraison', 'Délai estimé', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#8b6030] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0e8d8]">
                {loading ? Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-5 py-3"><div className="skeleton h-10 rounded-lg" /></td></tr>
                )) : zones.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-[#8b6030]">
                    <p className="text-3xl mb-2">🚚</p>
                    <p>Aucune zone configurée.</p>
                    <button onClick={openNew} className="btn-primary mt-3 text-sm py-2 px-5">Créer la première zone</button>
                  </td></tr>
                ) : zones.map(z => (
                  <tr key={z.id} className="hover:bg-[#faf6f0] transition-colors">
                    <td className="px-5 py-4">
                      <span className="tag-chip font-mono text-xs">{z.code}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#1a1208]">{z.name}</td>
                    <td className="px-5 py-4 text-[#5c4a2a] text-xs">{(z as any).description || '—'}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-[#e8720a]">
                        {z.base_cost === 0 ? 'Gratuit' : `${z.base_cost.toLocaleString('fr-SN')} FCFA`}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#5c4a2a]">{z.delay_label}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(z)}
                          className="flex items-center gap-1 text-xs text-[#0052cc] hover:underline font-semibold">
                          <Pencil size={12} /> Modifier
                        </button>
                        <button onClick={() => handleDelete(z.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold">
                          <Trash2 size={12} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
