import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lokaly — Artisanat sénégalais',
  description: 'Plateforme e-commerce de produits artisanaux locaux sénégalais',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
