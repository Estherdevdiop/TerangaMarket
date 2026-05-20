'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, Menu, X, LogOut, Heart, ChevronDown } from 'lucide-react'
import { isLoggedIn, getMe, logout } from '@/lib/auth'
import type { User as UserType } from '@/lib/auth'
import api from '@/lib/api'

const CATEGORIES = [
  { name: 'Sacs artisanaux',    slug: 'sacs-artisanaux' },
  { name: 'Portefeuilles',      slug: 'portefeuilles' },
  { name: 'Ceintures',          slug: 'ceintures' },
  { name: 'Chaussures',         slug: 'chaussures-artisanales' },
  { name: 'Bijoux',             slug: 'bijoux-artisanaux' },
  { name: 'Accessoires textiles', slug: 'accessoires-textiles' },
]

export default function Navbar() {
  const [user, setUser]           = useState<UserType | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catOpen, setCatOpen]     = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    if (isLoggedIn()) {
      getMe().then(setUser)
      api.get('/cart').then(r => setCartCount(r.data.items?.length || 0)).catch(() => {})
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/produits?q=${encodeURIComponent(search)}`
  }

  const dashboardLink = user?.role === 'ADMIN' ? '/admin' : user?.role === 'VENDEUR' ? '/vendeur' : '/compte'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#f0e8d8] shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <span className="font-display text-2xl font-bold text-[#e8720a] tracking-tight">
            TerangaMarket
          </span>
          <span className="text-xs text-[#8b6030] block -mt-1 leading-none">artisanat sénégalais</span>
        </Link>

        {/* Categories dropdown — desktop */}
        <div className="hidden md:block relative" onMouseLeave={() => setCatOpen(false)}>
          <button
            onMouseEnter={() => setCatOpen(true)}
            className="flex items-center gap-1 text-sm font-medium text-[#5c4a2a] hover:text-[#e8720a] transition-colors py-2 px-3 rounded-lg hover:bg-[#faf6f0]"
          >
Catégories <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
          </button>
          {catOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-[#f0e8d8] w-56 py-2 z-50">
              {CATEGORIES.map(c => (
                <Link key={c.slug} href={`/produits?categorie=${c.slug}`}
                  className="block px-4 py-2.5 text-sm text-[#3d280f] hover:bg-[#faf6f0] hover:text-[#e8720a] transition-colors">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex items-center gap-2">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c4a472]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un produit, artisan, tag..."
              className="input-base pl-9 py-2 text-sm"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          {/* Cart */}
          <Link href="/panier" className="relative p-2 rounded-lg hover:bg-[#faf6f0] transition-colors">
<span className="text-[#5c4a2a] font-semibold">Panier</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#e8720a] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="relative" onMouseLeave={() => setUserOpen(false)}>
              <button onMouseEnter={() => setUserOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-[#5c4a2a] hover:text-[#e8720a] px-3 py-2 rounded-lg hover:bg-[#faf6f0] transition-colors">
                <User size={18} /> {user.name.split(' ')[0]}
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-[#f0e8d8] w-48 py-2 z-50">
                  <Link href={dashboardLink} className="block px-4 py-2.5 text-sm text-[#3d280f] hover:bg-[#faf6f0]">
                    Mon espace
                  </Link>
                  <Link href="/compte/commandes" className="block px-4 py-2.5 text-sm text-[#3d280f] hover:bg-[#faf6f0]">
                    Mes commandes
                  </Link>
                  <hr className="my-1 border-[#f0e8d8]" />
                  <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn-primary text-sm py-2 px-4">
              Connexion
            </Link>
          )}

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#f0e8d8] px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..." className="input-base text-sm" />
            <button type="submit" className="btn-primary py-2 px-3"><Search size={16} /></button>
          </form>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#c4a472] uppercase tracking-wider px-2 py-1">Catégories</p>
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/produits?categorie=${c.slug}`}
                className="block py-2 px-2 text-sm text-[#3d280f] hover:text-[#e8720a]"
                onClick={() => setMobileOpen(false)}>
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
