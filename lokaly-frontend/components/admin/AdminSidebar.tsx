'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin',                icon: '📊', label: 'Dashboard' },
  { href: '/admin/produits',       icon: '📦', label: 'Produits' },
  { href: '/admin/commandes',      icon: '🛒', label: 'Commandes' },
  { href: '/admin/utilisateurs',   icon: '👥', label: 'Utilisateurs' },
  { href: '/admin/analytics',      icon: '📈', label: 'Analytics CTR' },
  { href: '/admin/livraison',      icon: '🚚', label: 'Zones livraison' },
  { href: '/',                     icon: '🏪', label: 'Voir la boutique' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-[#1a1208] flex-shrink-0 hidden md:flex flex-col p-4 gap-1 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="mb-8 px-2 pt-2">
        <span className="font-display text-2xl font-bold text-[#e8720a]">TerangaMarket</span>
        <p className="text-xs text-[#c4a472] mt-0.5">Administration</p>
      </div>

      {/* Nav links */}
      {NAV.map(({ href, icon, label }) => {
        const isActive = pathname === href || (href !== '/admin' && href !== '/' && pathname.startsWith(href))
        return (
          <Link key={href} href={href}
            className={`sidebar-link ${isActive ? 'active' : ''}`}>
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{label}</span>
          </Link>
        )
      })}

      {/* Bottom info */}
      <div className="mt-auto px-2 pt-6 border-t border-[#3d280f]">
        <p className="text-xs text-[#6e4a22]">MVP — Master 2</p>
        <p className="text-xs text-[#6e4a22]">TerangaMarket · Dakar 🇸🇳</p>
      </div>
    </aside>
  )
}
