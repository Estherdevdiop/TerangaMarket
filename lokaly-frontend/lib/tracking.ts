import api from './api'

export type EventType =
  | 'product_view' | 'search_performed' | 'filter_applied'
  | 'add_to_cart'  | 'remove_from_cart'
  | 'checkout_started' | 'order_created' | 'order_paid'
  | 'payment_simulation_started' | 'payment_simulation_success' | 'payment_simulation_failed'
  | 'recommendation_impression'  | 'recommendation_click'
  | 'recommendation_add_to_cart' | 'recommendation_order_assist'

interface TrackPayload {
  event_type: EventType
  product_id?: number
  source_page?: string
  source_algorithm?: string
  rank_position?: number
  zone_livraison?: string
  metadata?: Record<string, unknown>
}

// Generate or get anonymous session ID
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sid = sessionStorage.getItem('lokaly_sid')
  if (!sid) {
    sid = `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem('lokaly_sid', sid)
  }
  return sid
}

export async function track(payload: TrackPayload) {
  try {
    await api.post('/events', { ...payload, session_id: getSessionId() })
  } catch {
    // Silent fail — tracking should never break UX
  }
}

export async function trackImpression(productId: number, algorithm: string, position: number, context: string) {
  try {
    await api.post('/recommendations/track-impression', {
      product_id: productId,
      source_algorithm: algorithm,
      rank_position: position,
      context,
      session_id: getSessionId(),
    })
  } catch { /* silent */ }
}

export async function trackClick(productId: number, algorithm: string, position: number, context: string) {
  try {
    await api.post('/recommendations/track-click', {
      product_id: productId,
      source_algorithm: algorithm,
      rank_position: position,
      context,
      session_id: getSessionId(),
    })
  } catch { /* silent */ }
}
