import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Minus, Plus, Package, Phone, User, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { offersApi, ordersApi } from '../lib/api';
import type { PublicOffer, OfferLandingProduct } from '../types';

// Same fixed delivery fee and label as Checkout.tsx
const DELIVERY_FEE = 8;
const DELIVERY_METHOD = 'All Tunisia Delivery';
const MAX_QUANTITY = 10;

interface Selection {
  selected: boolean;
  sizeId: string | null;
  quantity: number;
}

const unitPrice = (product: OfferLandingProduct, sizeId: string | null) =>
  product.sizes.find(s => s.id === sizeId)?.price ?? product.price;

// Accepts 8 digits, optionally prefixed with +216 / 00216, spaces ignored
const isValidPhone = (phone: string) => /^(\+216|00216)?\d{8}$/.test(phone.replace(/[\s.-]/g, ''));

// src/index.css is a precompiled Tailwind build: only classes already in it work,
// so anything missing from it is written as an inline style below.
const inputClass = 'w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#d4af37]/50';

function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <Package size={28} style={{ color: 'rgba(212, 175, 55, 0.4)' }} />
    </div>
  );
}

export default function OfferLanding() {
  const { slug = '' } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<PublicOffer | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'ended' | 'error'>('loading');
  const [selections, setSelections] = useState<Record<string, Selection>>({});

  const [form, setForm] = useState({ clientName: '', phone: '', city: '', address: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedPhone, setPlacedPhone] = useState<string | null>(null);

  // ── Load offer ────────────────────────────────────────────
  const loadOffer = useCallback(async () => {
    setStatus('loading');
    try {
      const data = await offersApi.getBySlug(slug);
      if (!data) {
        setStatus('ended');
        return;
      }
      setOffer(data);
      // Every product starts selected with its cheapest size
      setSelections(Object.fromEntries(data.products.map(p => [
        p.id,
        { selected: true, sizeId: p.sizes[0]?.id ?? null, quantity: 1 },
      ])));
      setStatus('ready');
    } catch (err) {
      console.error('Failed to load offer:', err);
      setStatus('error');
    }
  }, [slug]);

  useEffect(() => {
    loadOffer();
  }, [loadOffer]);

  // Count the visit once per browser session so refreshes don't inflate stats
  useEffect(() => {
    if (status !== 'ready') return;
    const key = `offer_visit_${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Storage blocked (private mode): still count it
    }
    offersApi.trackVisit(slug);
  }, [status, slug]);

  useEffect(() => {
    if (offer) document.title = `${offer.title} · Hama Fragrance`;
  }, [offer]);

  // ── Derived totals ────────────────────────────────────────
  const chosen = useMemo(
    () => (offer?.products || []).filter(p => selections[p.id]?.selected),
    [offer, selections]
  );

  const subtotal = useMemo(
    () => chosen.reduce((sum, p) => sum + unitPrice(p, selections[p.id].sizeId) * selections[p.id].quantity, 0),
    [chosen, selections]
  );

  const total = chosen.length > 0 ? subtotal + DELIVERY_FEE : 0;

  // ── Handlers ──────────────────────────────────────────────
  const updateSelection = (productId: string, changes: Partial<Selection>) => {
    setSelections(prev => ({ ...prev, [productId]: { ...prev[productId], ...changes } }));
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offer) return;

    if (chosen.length === 0) {
      setFormError('Choose at least one perfume');
      return;
    }
    if (!form.clientName.trim() || !form.city.trim() || !form.address.trim()) {
      setFormError('Fill in your name, city and address');
      return;
    }
    if (!isValidPhone(form.phone)) {
      setFormError('Enter a valid phone number (8 digits)');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    try {
      const summary = chosen.map(p => {
        const size = p.sizes.find(s => s.id === selections[p.id].sizeId);
        return `${p.name} (${selections[p.id].quantity} - ${size?.name || 'Standard'})`;
      }).join(', ');

      await ordersApi.create({
        clientName: form.clientName.trim(),
        phoneNumber: form.phone.trim(),
        place: `${form.address.trim()}, ${form.city.trim()}`,
        product: summary,
        quantity: chosen.reduce((sum, p) => sum + selections[p.id].quantity, 0),
        items: chosen.map(p => ({
          id: p.id,
          quantity: selections[p.id].quantity,
          shippingMethodId: selections[p.id].sizeId,
        })),
        totalPrice: total,
        shippingFee: DELIVERY_FEE,
        deliveryMethod: DELIVERY_METHOD,
        offerId: offer.id,
      });
      setPlacedPhone(form.phone.trim());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setFormError(err.message || 'Your order could not be sent. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Layout pieces ─────────────────────────────────────────
  const header = (
    <header className="border-b border-white/10 py-4 px-4 text-center">
      <button
        onClick={() => navigate('/')}
        className="font-serif text-xl text-[#d4af37] tracking-wider hover:text-[#f0c952] transition-colors"
      >
        Hama Fragrance
      </button>
    </header>
  );

  const shopButton = (
    <button
      onClick={() => navigate('/shop')}
      style={{ letterSpacing: '0.3em' }}
      className="px-6 py-3 border border-[#d4af37] text-[#d4af37] text-xs uppercase hover:bg-[#d4af37] hover:text-black transition-all"
    >
      Visit the shop
    </button>
  );

  if (status !== 'ready' || !offer) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {header}
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          {status === 'loading' && <p className="text-white/50">Loading offer...</p>}
          {status === 'ended' && (
            <>
              <h1 className="font-serif text-3xl text-white mb-3">This offer has ended</h1>
              <p className="text-white/50 mb-8">The link is no longer active, but our full collection is waiting for you.</p>
              {shopButton}
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="font-serif text-2xl text-white mb-3">Couldn't load this offer</h1>
              <p className="text-white/50 mb-8">Check your connection and try again.</p>
              <button onClick={loadOffer} className="px-6 py-3 border border-white/30 text-white text-sm hover:bg-white/10 transition-colors">
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (placedPhone) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        {header}
        <motion.div
          className="max-w-md mx-auto px-4 py-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 mx-auto mb-8 border border-[#d4af37]/40 bg-[#d4af37]/10 flex items-center justify-center">
            <Check size={36} className="text-[#d4af37]" />
          </div>
          <h1 className="font-serif text-3xl text-white mb-4">Order received</h1>
          <p className="text-white/60 mb-2">Thank you, {form.clientName.trim()}.</p>
          <p className="text-white/60 mb-8">
            We'll call you on <span className="text-[#d4af37]">{placedPhone}</span> to confirm your order.
            You pay cash on delivery.
          </p>
          {shopButton}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {header}

      <main className="max-w-lg mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-serif text-3xl text-white mb-2 text-center">{offer.title}</h1>
          <p className="text-white/50 text-sm text-center mb-8">
            {offer.products.length > 1 ? 'Choose one or more, then pick your size' : 'Pick your size'}
          </p>

          {/* Products */}
          <div className="space-y-4 mb-8">
            {offer.products.map(product => {
              const sel = selections[product.id];
              if (!sel) return null;
              return (
                <div
                  key={product.id}
                  style={sel.selected ? { backgroundColor: 'rgba(212, 175, 55, 0.05)' } : undefined}
                  className={`border rounded-sm p-4 transition-colors ${sel.selected ? 'border-[#d4af37]/50' : 'border-white/10'}`}
                >
                  <button
                    type="button"
                    onClick={() => updateSelection(product.id, { selected: !sel.selected })}
                    className="w-full flex items-center gap-4 text-left"
                    aria-pressed={sel.selected}
                  >
                    <div className="w-16 h-20 bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                      <ProductImage src={product.mainImage} alt={product.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-serif text-lg leading-tight">{product.name}</h2>
                      {product.inspiredBy && (
                        <p className="text-white/50 text-xs mt-1">Inspired by {product.inspiredBy}</p>
                      )}
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${sel.selected ? 'bg-[#d4af37] border-[#d4af37]' : 'border-white/30'}`}
                    >
                      {sel.selected && <Check size={14} className="text-black" />}
                    </div>
                  </button>

                  {sel.selected && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.length > 0 ? (
                          product.sizes.map(size => (
                            <button
                              key={size.id}
                              type="button"
                              onClick={() => updateSelection(product.id, { sizeId: size.id })}
                              className={`px-3 py-2 text-sm rounded-sm border transition-colors ${sel.sizeId === size.id ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/10' : 'border-white/20 text-white/70 hover:text-white'}`}
                            >
                              {size.name} · {size.price} TND
                            </button>
                          ))
                        ) : (
                          <span className="px-3 py-2 text-sm text-[#d4af37]">{product.price} TND</span>
                        )}
                      </div>
                      <div className="flex items-center border border-white/20 rounded-sm">
                        <button
                          type="button"
                          onClick={() => updateSelection(product.id, { quantity: Math.max(1, sel.quantity - 1) })}
                          className="p-2 text-white/60 hover:text-white disabled:opacity-50"
                          disabled={sel.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-white text-sm">{sel.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateSelection(product.id, { quantity: Math.min(MAX_QUANTITY, sel.quantity + 1) })}
                          className="p-2 text-white/60 hover:text-white disabled:opacity-50"
                          disabled={sel.quantity >= MAX_QUANTITY}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="border-t border-white/10 pt-4 mb-8 space-y-2 text-sm">
            <div className="flex justify-between text-white/60">
              <span>Perfumes</span>
              <span>{subtotal.toFixed(2)} TND</span>
            </div>
            <div className="flex justify-between text-white/60">
              <span className="flex items-center gap-2"><Truck size={14} /> Delivery, all Tunisia</span>
              <span>{chosen.length > 0 ? `${DELIVERY_FEE.toFixed(2)} TND` : '—'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-white">Total</span>
              <span className="text-[#d4af37] text-2xl font-serif">{total.toFixed(2)} TND</span>
            </div>
          </div>

          {/* Quick order form */}
          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <h2 className="text-white font-serif text-xl mb-1">Your details</h2>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Full name" autoComplete="name" className={inputClass} />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input name="phone" type="tel" inputMode="tel" value={form.phone} onChange={handleChange} placeholder="Phone (20 123 456)" autoComplete="tel" className={inputClass} />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" autoComplete="address-level2" className={inputClass} />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" autoComplete="street-address" className={inputClass} />
            </div>

            {formError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
                <p className="text-red-400 text-sm">{formError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#d4af37] text-black font-medium tracking-wide hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Sending your order...' : `Order now · ${total.toFixed(2)} TND`}
            </button>
            <p className="flex items-center justify-center gap-2 text-white/40 text-xs pt-1">
              <ShieldCheck size={14} /> Cash on delivery. We call you to confirm before shipping.
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
