import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#291a08] text-[#c4a472] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <span className="font-display text-2xl font-bold text-[#e8720a]">Lokaly</span>
          <p className="mt-3 text-sm text-[#a87d45] leading-relaxed">
            La plateforme de référence pour l'artisanat de mode et la maroquinerie locale sénégalaise.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Catalogue</h4>
          <ul className="space-y-2 text-sm">
            {['Sacs artisanaux','Portefeuilles','Ceintures','Chaussures','Bijoux','Accessoires textiles'].map(c => (
              <li key={c}><Link href={`/produits?categorie=${c.toLowerCase().replace(/ /g,'-')}`} className="hover:text-[#e8720a] transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Mon compte</h4>
          <ul className="space-y-2 text-sm">
            {[['Connexion','/auth/login'],['Inscription','/auth/register'],['Mes commandes','/compte/commandes'],['Mon profil','/compte']].map(([l,h]) => (
              <li key={l}><Link href={h} className="hover:text-[#e8720a] transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Vendeurs</h4>
          <ul className="space-y-2 text-sm">
            {[['Espace vendeur','/vendeur'],['Créer un compte vendeur','/auth/register?role=vendeur']].map(([l,h]) => (
              <li key={l}><Link href={h} className="hover:text-[#e8720a] transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-[#3d280f] px-4 py-4 text-center text-xs text-[#6e4a22]">
        © {new Date().getFullYear()} Lokaly — Plateforme e-commerce intelligente · Dakar, Sénégal
      </div>
    </footer>
  )
}
