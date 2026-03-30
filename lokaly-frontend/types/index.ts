export interface Category {
  id: number
  name: string
  slug: string
  parent_id?: number
  children?: Category[]
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category: Category
  vendor: Vendor
  region_origin: string
  material?: string
  color?: string
  style?: string
  technique?: string
  occasion?: string
  is_local: boolean
  status: 'draft' | 'pending' | 'published' | 'disabled'
  images: ProductImage[]
  tags: string[]
  created_at: string
}

export interface ProductImage {
  id: number
  url: string
  is_primary: boolean
}

export interface Vendor {
  id: number
  boutique_name: string
  region: string
  user_id: number
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  total: number
}

export interface DeliveryZone {
  id: number
  code: string
  name: string
  base_cost: number
  delay_label: string
}

export interface Order {
  id: number
  items: OrderItem[]
  total: number
  shipping_cost: number
  delivery_zone: DeliveryZone
  status: 'en_attente' | 'paiement_en_cours' | 'payee' | 'livree' | 'annulee' | 'echec_paiement'
  payment_type: 'wave' | 'orange_money' | 'livraison'
  created_at: string
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  unit_price: number
}

export interface RecommendationItem {
  product: Product
  algorithm: string
  position: number
  score?: number
}

export interface VendorStats {
  total_views: number
  total_reco_clicks: number
  total_cart_adds: number
  total_sales: number
  out_of_stock_count: number
}

export interface AnalyticsData {
  ctr_global: number
  ctr_by_block: { home: number; product_detail: number; cart: number }
  ctr_by_algorithm: { popular: number; content: number; hybrid: number; association: number; knn: number }
  add_to_cart_rate: number
  assisted_conversion: number
  top_recommended: { product: Product; impressions: number }[]
  top_clicked: { product: Product; clicks: number }[]
}
