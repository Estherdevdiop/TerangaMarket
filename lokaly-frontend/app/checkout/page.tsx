'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle2, XCircle, Clock, Phone, CreditCard } from 'lucide-react'
import api from '@/lib/api'
import { track } from '@/lib/tracking'
import type { Cart, DeliveryZone } from '@/types'

type PayMethod = 'wave' | 'orange_money' | 'livraison'
type Step = 'recap' | 'livraison' | 'paiement' | 'confirmation'
type SimStatus = 'idle' | 'pending' | 'success' | 'failed' | 'expired'

export default function CheckoutPage() {
  const [cart, setCart]       = useState<Cart | null>(null)
  const [zones, setZones]     = useState<DeliveryZone[]>([])
  const [zone, setZone]       = useState<DeliveryZone | null>(null)
  const [method, setMethod]   = useState<PayMethod>('wave')
  const [phone, setPhone]     = useState('')
  const [step, setStep]       = useState<Step>('recap')
  const [simStatus, setSimStatus] = useState<SimStatus>('idle')
  const [orderId, setOrderId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/cart').then(r => setCart(r.data)).catch(() => {})
    api.get('/delivery-zones').then(r => setZones(r.data)).catch(() => {})
  }, [])

  const total = (cart?.subtotal || 0) + (zone?.base_cost || 0)

  const handlePlaceOrder = async () => {
    if (!zone) return alert('Choisissez une zone de livraison.')
    setLoading(true)
    try {
      const res = await api.post('/checkout', {
        delivery_zone_id: zone.id,
        payment_type: method,
      })
      setOrderId(res.data.id)
      await track({ event_type: 'order_created', source_page: 'checkout', zone_livraison: zone.code })

      if (method === 'livraison') {
        setStep('confirmation')
        return
      }
      // Mobile payment simulation
      setStep('paiement')
      simulatePayment(res.data.id)
    } catch {
      alert('Erreur lors de la commande.')
    } finally { setLoading(false) }
  }

  const simulatePayment = async (oid: number) => {
    setSimStatus('pending')
    await track({ event_type: 'payment_simulation_started', source_page: 'checkout' })
    // Simulate USSD wait (3 seconds)
    await new Promise(r => setTimeout(r, 3000))
    try {
      const res = await api.post('/payments/simulate', {
        order_id: oid,
        method,
        phone,
      })
      const status: SimStatus = res.data.status
      setSimStatus(status)
      await track({ event_type: status === 'success' ? 'payment_simulation_success' : 'payment_simulation_failed', source_page: 'checkout' })
      if (status === 'success') {
        await track({ event_type: 'order_paid', source_page: 'checkout' })
        setTimeout(() => setStep('confirmation'), 1500)
      }
    } catch {
      setSimStatus('failed')
    }
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[['recap','1','Récapitulatif'],['livraison','2','Livraison'],['paiement','3','Paiement'],['confirmation','4','Confirmation']].map(([s, n, label], i) => {
        const steps: Step[] = ['recap','livraison','paiement','confirmation']
        const idx = steps.indexOf(s as Step)
        const curIdx = steps.indexOf(step)
        const done = idx < curIdx
        const active = s === step
        return (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${active ? 'text-[#e8720a]' : done ? 'text-[#1a6b3c]' : 'text-[#c4a472]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${active ? 'bg-[#e8720a] text-white' : done ? 'bg-[#1a6b3c] text-white' : 'bg-[#f0e8d8] text-[#c4a472]'}`}>
                {done ? '✓' : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {i < 3 && <div className={`w-8 h-0.5 ${idx < curIdx ? 'bg-[#1a6b3c]' : 'bg-[#f0e8d8]'}`} />}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10 page-enter">
        <h1 className="font-display text-3xl font-bold text-[#1a1208] mb-6 text-center">Passer ma commande</h1>
        <StepIndicator />

        {/* STEP 1 — Récapitulatif */}
        {step === 'recap' && cart && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-[#1a1208]">Votre commande</h2>
            {cart.items.map(item => (
              <div key={item.id} className="flex gap-3 text-sm">
                <img src={item.product.images?.[0]?.url || `https://picsum.photos/seed/${item.product.id}/60/60`}
                  alt={item.product.name} className="w-12 h-12 rounded-xl object-cover bg-[#f0e8d8]" />
                <div className="flex-1">
                  <p className="font-medium text-[#1a1208] line-clamp-1">{item.product.name}</p>
                  <p className="text-[#8b6030] text-xs">Qté : {item.quantity}</p>
                </div>
                <p className="font-semibold text-[#e8720a]">
                  {(item.product.price * item.quantity).toLocaleString('fr-SN')} FCFA
                </p>
              </div>
            ))}
            <div className="border-t border-[#f0e8d8] pt-3 flex justify-between font-bold text-[#1a1208]">
              <span>Sous-total</span>
              <span>{cart.subtotal?.toLocaleString('fr-SN')} FCFA</span>
            </div>
            <button onClick={() => setStep('livraison')} className="btn-primary w-full py-3">
              Choisir la livraison →
            </button>
          </div>
        )}

        {/* STEP 2 — Zone de livraison */}
        {step === 'livraison' && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-6 space-y-4">
            <h2 className="font-display font-bold text-xl text-[#1a1208]">Zone de livraison</h2>
            <div className="space-y-3">
              {zones.map(z => (
                <label key={z.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${zone?.id === z.id ? 'border-[#e8720a] bg-[#fff8f0]' : 'border-[#f0e8d8] hover:border-[#ddc9a8]'}`}>
                  <input type="radio" name="zone" value={z.id}
                    checked={zone?.id === z.id}
                    onChange={() => setZone(z)}
                    className="accent-[#e8720a]" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1208]">{z.name}</p>
                    <p className="text-xs text-[#8b6030]">{z.delay_label}</p>
                  </div>
                  <span className="font-bold text-[#e8720a]">
                    {z.base_cost === 0 ? 'Gratuit' : `${z.base_cost.toLocaleString('fr-SN')} FCFA`}
                  </span>
                </label>
              ))}
            </div>
            {zone && (
              <div className="bg-[#faf6f0] rounded-xl p-3 text-sm">
                <div className="flex justify-between"><span className="text-[#5c4a2a]">Sous-total</span><span>{cart?.subtotal?.toLocaleString('fr-SN')} FCFA</span></div>
                <div className="flex justify-between"><span className="text-[#5c4a2a]">Livraison</span><span>{zone.base_cost === 0 ? 'Gratuit' : `${zone.base_cost.toLocaleString('fr-SN')} FCFA`}</span></div>
                <div className="flex justify-between font-bold text-[#1a1208] mt-1 pt-1 border-t border-[#f0e8d8]">
                  <span>Total</span><span className="text-[#e8720a]">{total.toLocaleString('fr-SN')} FCFA</span>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep('recap')} className="btn-outline flex-1 py-3">← Retour</button>
              <button onClick={() => zone && setStep('paiement')} disabled={!zone} className="btn-primary flex-1 py-3 disabled:opacity-50">
                Choisir le paiement →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Paiement */}
        {step === 'paiement' && simStatus === 'idle' && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-6 space-y-5">
            <h2 className="font-display font-bold text-xl text-[#1a1208]">Mode de paiement</h2>
            <div className="space-y-3">
              {[
                { key: 'wave' as PayMethod, label: 'Wave', icon: '🌊', desc: 'Paiement mobile Wave' },
                { key: 'orange_money' as PayMethod, label: 'Orange Money', icon: '🟠', desc: 'Paiement mobile Orange Money' },
                { key: 'livraison' as PayMethod, label: 'Paiement à la livraison', icon: '🚚', desc: 'Payez à la réception' },
              ].map(opt => (
                <label key={opt.key} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${method === opt.key ? 'border-[#e8720a] bg-[#fff8f0]' : 'border-[#f0e8d8] hover:border-[#ddc9a8]'}`}>
                  <input type="radio" name="method" value={opt.key} checked={method === opt.key}
                    onChange={() => setMethod(opt.key)} className="accent-[#e8720a]" />
                  <span className="text-2xl">{opt.icon}</span>
                  <div>
                    <p className="font-semibold text-[#1a1208]">{opt.label}</p>
                    <p className="text-xs text-[#8b6030]">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {(method === 'wave' || method === 'orange_money') && (
              <div>
                <label className="block text-sm font-semibold text-[#1a1208] mb-2">
                  <Phone size={14} className="inline mr-1" /> Numéro de téléphone
                </label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="77 XXX XX XX" className="input-base"
                  type="tel" maxLength={12} />
              </div>
            )}

            <div className="bg-[#faf6f0] rounded-xl p-3 text-sm flex justify-between font-bold text-[#1a1208]">
              <span>Total à payer</span>
              <span className="text-[#e8720a]">{total.toLocaleString('fr-SN')} FCFA</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('livraison')} className="btn-outline flex-1 py-3">← Retour</button>
              <button onClick={handlePlaceOrder} disabled={loading || ((method !== 'livraison') && !phone.trim())}
                className="btn-primary flex-1 py-3 disabled:opacity-50">
                {loading ? 'Traitement...' : 'Confirmer →'}
              </button>
            </div>
          </div>
        )}

        {/* USSD Modal simulation */}
        {step === 'paiement' && simStatus !== 'idle' && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-8 text-center space-y-5">
            {simStatus === 'pending' && (
              <>
                <div className="w-16 h-16 border-4 border-[#e8720a] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-display font-bold text-xl text-[#1a1208]">
                  {method === 'wave' ? '🌊 Wave' : '🟠 Orange Money'} en cours...
                </p>
                <p className="text-sm text-[#8b6030]">
                  Validation USSD en attente sur le numéro <strong>{phone}</strong>.<br />
                  Veuillez confirmer sur votre téléphone.
                </p>
                <div className="bg-[#faf6f0] rounded-xl p-3 font-mono text-sm text-[#3d280f]">
                  Montant : {total.toLocaleString('fr-SN')} FCFA
                </div>
              </>
            )}
            {simStatus === 'success' && (
              <>
                <CheckCircle2 size={56} className="text-[#1a6b3c] mx-auto" />
                <p className="font-display font-bold text-xl text-[#1a6b3c]">Paiement confirmé !</p>
                <p className="text-sm text-[#8b6030]">Redirection vers la confirmation...</p>
              </>
            )}
            {(simStatus === 'failed' || simStatus === 'expired') && (
              <>
                <XCircle size={56} className="text-red-500 mx-auto" />
                <p className="font-display font-bold text-xl text-red-600">
                  {simStatus === 'expired' ? 'Délai expiré' : 'Paiement refusé'}
                </p>
                <p className="text-sm text-[#8b6030]">La transaction n'a pas pu être complétée.</p>
                <button onClick={() => setSimStatus('idle')} className="btn-primary py-3 px-8">
                  Réessayer
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 4 — Confirmation */}
        {step === 'confirmation' && (
          <div className="bg-white rounded-2xl border border-[#f0e8d8] p-8 text-center space-y-5">
            <div className="w-20 h-20 bg-[#d1e7dd] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={44} className="text-[#1a6b3c]" />
            </div>
            <h2 className="font-display font-bold text-2xl text-[#1a1208]">Commande confirmée !</h2>
            {orderId && (
              <p className="text-sm text-[#8b6030]">
                Numéro de commande : <strong className="text-[#e8720a]">#{orderId}</strong>
              </p>
            )}
            <p className="text-sm text-[#5c4a2a] leading-relaxed">
              {method === 'livraison'
                ? 'Votre commande est enregistrée. Le paiement sera effectué à la livraison.'
                : 'Votre paiement a été validé. Votre commande est en cours de traitement.'}
            </p>
            {zone && (
              <div className="bg-[#faf6f0] rounded-xl p-3 text-sm text-left space-y-1">
                <div className="flex justify-between"><span className="text-[#8b6030]">Zone de livraison</span><span>{zone.name}</span></div>
                <div className="flex justify-between"><span className="text-[#8b6030]">Délai estimé</span><span>{zone.delay_label}</span></div>
                <div className="flex justify-between font-bold"><span>Total payé</span><span className="text-[#e8720a]">{total.toLocaleString('fr-SN')} FCFA</span></div>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <a href="/compte/commandes" className="btn-outline py-2 px-5 text-sm">Mes commandes</a>
              <a href="/produits" className="btn-primary py-2 px-5 text-sm">Continuer mes achats</a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
