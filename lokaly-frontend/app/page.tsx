import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import RecommendationBlock from '@/components/recommendation/RecommendationBlock'
import Link from 'next/link'

const CATEGORIES = [
  { name: 'Sacs artisanaux',    slug: 'sacs-artisanaux',    image: 'https://source.unsplash.com/featured/300x300/?handmade,bags,leather', color: '#ffeedd' },
  { name: 'Portefeuilles',      slug: 'portefeuilles',       image: 'https://source.unsplash.com/featured/300x300/?wallet,leather', color: '#e8f5e9' },
  { name: 'Ceintures',          slug: 'ceintures',           image: 'https://source.unsplash.com/featured/300x300/?belt,leather', color: '#e3f2fd' },
  { name: 'Chaussures',         slug: 'chaussures-artisanales', image: 'https://source.unsplash.com/featured/300x300/?shoe,artisan,leather', color: '#fff3e0' },
  { name: 'Bijoux',             slug: 'bijoux-artisanaux',   image: 'https://source.unsplash.com/featured/300x300/?jewelry,artisan,handmade', color: '#f3e5f5' },
  { name: 'Accessoires',        slug: 'accessoires-textiles',image: 'https://source.unsplash.com/featured/300x300/?textile,accessory,handmade', color: '#e8f5e9' },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="page-enter">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#291a08] via-[#3d280f] to-[#5c2a00] text-white">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #e8720a 0, #e8720a 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <span className="inline-block bg-[#e8720a]/20 text-[#ffb46a] text-sm font-semibold px-4 py-1.5 rounded-full border border-[#e8720a]/30">
                🇸🇳 Artisanat local sénégalais
              </span>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                L'artisanat <br />
                <span className="text-[#e8720a]">sénégalais</span><br />
                à portée de clic
              </h1>
              <p className="text-[#c4a472] text-lg max-w-md leading-relaxed">
                Découvrez les créations uniques d'artisans locaux — sacs, maroquinerie, bijoux et textiles faits à la main.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/produits" className="btn-primary py-3 px-8 text-base">
                  Explorer le catalogue
                </Link>
                <Link href="/auth/register?role=vendeur" className="btn-outline py-3 px-8 text-base border-[#c4a472] text-[#c4a472] hover:bg-[#c4a472] hover:text-[#291a08]">
                  Devenir vendeur
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-72">
              {[1,2,3,4].map(i => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-[#3d280f]">
                  <img src={`https://picsum.photos/seed/hero${i}/300/300`} alt="" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="font-display text-2xl font-bold text-[#1a1208] mb-6">Parcourir par catégorie</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/produits?categorie=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:shadow-md transition-all border border-[#f0e8d8] hover:border-[#e8720a]/30"
                style={{ background: cat.color }}>
                <div className="w-16 h-16 rounded-full overflow-hidden border border-[#e8720a]/20 bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-[#3d280f] text-center leading-snug">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Recommendation blocks ── */}
        <div className="max-w-7xl mx-auto px-4 space-y-12 pb-16">
          <RecommendationBlock
            title="🔥 Top produits"
            endpoint="/recommendations/home?type=top"
            context="home"
            emptyMessage="Les produits populaires apparaîtront ici."
          />
          <RecommendationBlock
            title="✨ Nouveautés"
            endpoint="/recommendations/home?type=new"
            context="home"
            emptyMessage="Revenez bientôt pour découvrir nos nouveautés."
          />
          <RecommendationBlock
            title="💡 Recommandations pour vous"
            endpoint="/recommendations/home?type=personalized"
            context="home"
            emptyMessage="Naviguez dans le catalogue pour personnaliser vos recommandations."
          />
        </div>

        {/* ── Trust banner ── */}
        <section className="bg-[#1a6b3c] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '🤝', title: 'Artisans vérifiés', desc: 'Chaque vendeur est modéré et validé par notre équipe.' },
              { icon: '🚚', title: 'Livraison Sénégal', desc: 'Livraison sur Dakar et dans toutes les régions.' },
              { icon: '📱', title: 'Paiement mobile', desc: 'Wave & Orange Money acceptés au checkout.' },
            ].map(item => (
              <div key={item.title} className="space-y-2">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-display font-bold text-lg">{item.title}</h3>
                <p className="text-green-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
