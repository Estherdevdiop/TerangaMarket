# Lokaly — Frontend Next.js

Plateforme e-commerce intelligente de produits artisanaux sénégalais.
**Next.js 14 · TypeScript · Tailwind CSS · App Router**

---

## 🚀 Démarrage rapide

```bash
npm install
cp .env.local.example .env.local   # Configurer l'URL de l'API
npm run dev                         # http://localhost:3000
```

---

## ⚙️ Configuration

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📁 Structure du projet

```
lokaly-frontend/
├── app/                         # Pages Next.js App Router
│   ├── page.tsx                 # Accueil
│   ├── produits/
│   │   ├── page.tsx             # Liste produits + filtres
│   │   └── [slug]/page.tsx      # Fiche produit + recommandations
│   ├── panier/page.tsx          # Panier
│   ├── checkout/page.tsx        # Checkout (zones livraison + Wave/OM)
│   ├── auth/
│   │   ├── login/page.tsx       # Connexion
│   │   └── register/page.tsx    # Inscription (client + vendeur)
│   ├── compte/
│   │   └── commandes/page.tsx   # Historique commandes client
│   ├── vendeur/
│   │   ├── page.tsx             # Tableau de bord vendeur
│   │   └── produits/nouveau/page.tsx  # Formulaire nouveau produit
│   └── admin/
│       ├── page.tsx             # Dashboard admin + CTR analytics
│       ├── produits/page.tsx    # Modération produits vendeurs
│       └── livraison/page.tsx   # Gestion zones de livraison
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Navigation principale
│   │   └── Footer.tsx           # Pied de page
│   ├── product/
│   │   └── ProductCard.tsx      # Carte produit (avec tracking)
│   ├── recommendation/
│   │   └── RecommendationBlock.tsx  # Bloc recommandations + tracking
│   └── ui/
│       └── SkeletonCard.tsx     # Skeleton loading
├── lib/
│   ├── api.ts                   # Client Axios + intercepteurs JWT
│   ├── auth.ts                  # Login / Register / Logout / getMe
│   └── tracking.ts              # track() / trackImpression() / trackClick()
└── types/
    └── index.ts                 # Types TypeScript (Product, Order, etc.)
```

---

## 🔗 Endpoints API attendus (Django backend)

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion → retourne `{ access, user }` |
| POST | `/api/auth/logout` | Déconnexion |
| GET  | `/api/me` | Profil utilisateur connecté |

### Catalogue
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/products` | Liste paginée (filtres : q, categorie, prix_min, prix_max, region, material, style, occasion, tri) |
| GET | `/api/products/:slug` | Détail produit |
| GET | `/api/categories` | Arbre des catégories |
| GET | `/api/search?q=` | Recherche |

### Panier & Commandes
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/cart` | Récupérer le panier |
| POST | `/api/cart/items` | Ajouter un article `{ product_id, quantity }` |
| PATCH | `/api/cart/items/:id` | Modifier quantité |
| DELETE | `/api/cart/items/:id` | Supprimer un article |
| GET | `/api/delivery-zones` | Zones + tarifs de livraison |
| POST | `/api/checkout` | Créer commande `{ delivery_zone_id, payment_type }` |
| GET | `/api/orders` | Historique commandes |
| GET | `/api/orders/:id` | Détail commande |

### Paiement simulé
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/payments/simulate` | `{ order_id, method, phone }` → `{ status: 'success' | 'failed' | 'expired' }` |

### Recommandation
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/recommendations/home?type=top|new|personalized` | Blocs accueil |
| GET | `/api/recommendations/product/:id` | Produits similaires |
| GET | `/api/recommendations/user/:id` | Recommandations personnalisées |

**Format de réponse attendu :**
```json
[
  { "product": { ... }, "algorithm": "content", "position": 0, "score": 0.87 }
]
```

### Tracking
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/events` | Journaliser un événement |
| POST | `/api/recommendations/track-impression` | Impression d'un bloc reco |
| POST | `/api/recommendations/track-click` | Clic sur une recommandation |

### Espace Vendeur
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET/POST | `/api/vendor/products` | Liste et création produits |
| PATCH | `/api/vendor/products/:id` | Modifier un produit |
| GET | `/api/vendor/orders` | Commandes liées au vendeur |
| GET | `/api/vendor/stats` | Statistiques vendeur |

### Admin
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/products` | Tous les produits (filtrable par status) |
| PATCH | `/api/admin/products/:id/moderate` | Valider/refuser `{ status }` |
| GET | `/api/admin/analytics/recommendations?period=7d` | Analytics CTR |
| GET/POST/PATCH/DELETE | `/api/admin/delivery-zones` | Zones de livraison |

---

## 🎨 Design System

**Couleurs principales :**
- Brand orange : `#e8720a`
- Earth brown : `#8b6030`
- Kente green : `#1a6b3c`
- Warm background : `#faf6f0`

**Typographie :**
- Display : Playfair Display (titres, prix)
- Body : DM Sans (textes, UI)

---

## 📦 Pages implémentées

| Page | Route | Statut |
|------|-------|--------|
| Accueil | `/` | ✅ |
| Liste produits + filtres | `/produits` | ✅ |
| Fiche produit | `/produits/[slug]` | ✅ |
| Panier | `/panier` | ✅ |
| Checkout + Wave/OM | `/checkout` | ✅ |
| Connexion | `/auth/login` | ✅ |
| Inscription | `/auth/register` | ✅ |
| Mes commandes | `/compte/commandes` | ✅ |
| Dashboard Vendeur | `/vendeur` | ✅ |
| Nouveau produit | `/vendeur/produits/nouveau` | ✅ |
| Dashboard Admin + CTR | `/admin` | ✅ |
| Modération produits | `/admin/produits` | ✅ |
| Zones livraison | `/admin/livraison` | ✅ |

---

## 🔧 À connecter au backend

- [ ] Upload d'images produit (remplacer le placeholder dans `nouveau/page.tsx`)
- [ ] Authentification JWT persistante (token refresh)
- [ ] Pagination côté serveur sur la liste produits
- [ ] Gestion profil utilisateur (`/compte/page.tsx` à créer)
- [ ] Commandes admin (`/admin/commandes` à créer)
- [ ] Analytics avancés (`/admin/analytics` à créer avec filtres temporels)
