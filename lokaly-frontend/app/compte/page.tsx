'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getMe, type User } from '@/lib/auth'
import api from '@/lib/api'

export default function ComptePage() {
  const [user, setUser] = useState<User | null>(null)
  const [ordersCount, setOrdersCount] = useState(0)

  useEffect(() => {
    getMe().then(setUser)
    api.get('/orders').then((r) => setOrdersCount((r.data || []).length)).catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10 page-enter">
        <h1 className="font-display text-3xl font-bold text-[#1a1208] mb-8">Mon compte</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <section className="md:col-span-2 bg-white rounded-2xl border border-[#f0e8d8] p-6">
            <h2 className="font-display text-xl font-bold text-[#1a1208] mb-4">Informations</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span className="text-[#8b6030]">Nom</span><span className="font-medium text-[#1a1208]">{user?.name || '—'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#8b6030]">Email</span><span className="font-medium text-[#1a1208]">{user?.email || '—'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#8b6030]">Téléphone</span><span className="font-medium text-[#1a1208]">{user?.phone || '—'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#8b6030]">Région</span><span className="font-medium text-[#1a1208]">{user?.region || '—'}</span></div>
              <div className="flex justify-between gap-4"><span className="text-[#8b6030]">Rôle</span><span className="font-medium text-[#1a1208]">{user?.role || '—'}</span></div>
            </div>
          </section>
          <aside className="bg-white rounded-2xl border border-[#f0e8d8] p-6">
            <h2 className="font-display text-xl font-bold text-[#1a1208] mb-4">Activité</h2>
            <p className="text-sm text-[#8b6030] mb-3">Commandes enregistrées</p>
            <p className="font-display text-3xl font-bold text-[#e8720a] mb-5">{ordersCount}</p>
            <Link href="/compte/commandes" className="btn-primary block text-center py-3 text-sm">
              Voir mes commandes
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
