import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { ShoppingBag, ChevronLeft, ShieldCheck, X, ArrowRight, Tag, Phone, User, MapPin } from 'lucide-react';
import { type CartItem } from './Cart';

const PROMO_CODES = {
  'WELCOME10': 0.10,
  'BEY20': 0.20,
  'LUXURY15': 0.15,
};

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: {
    id: string;
    name: string;
    price: string;
    shippingMethodId?: string;
    sizeName?: string;
    concentration?: string;
  } | null;
  cartItems: CartItem[];
  onSubmitOrder: (orderData: {
    clientName: string;
    phoneNumber: string;
    place: string;
    product: string;
    quantity: number;
    items: any[];
    totalPrice: number;
    shippingFee: number;
    deliveryMethod: string;
  }) => Promise<void>;
  currentUser?: { id: string; name: string; email: string } | null;
}

export default function Checkout({
  isOpen,
  onClose,
  selectedProduct,
  cartItems,
  onSubmitOrder,
  currentUser,
}: CheckoutProps) {
  const [formData, setFormData] = useState({
    clientName: currentUser?.name || '',
    city: '',
    address: '',
    phone: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Reset success and errors when opening
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setError(null);
      setTouched({});
    }
  }, [isOpen]);

  const checkoutItems = useMemo(() => {
    if (selectedProduct) {
      return [{
        id: selectedProduct.id,
        productId: selectedProduct.id,
        shippingMethodId: selectedProduct.shippingMethodId,
        size: selectedProduct.sizeName || '50ml',
        concentration: selectedProduct.concentration,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
        image: '',
        notes: ''
      } as CartItem];
    }
    return cartItems;
  }, [selectedProduct, cartItems]);

  const subtotal = useMemo(() => {
    return checkoutItems.reduce((total, item) => {
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + priceValue * item.quantity;
    }, 0);
  }, [checkoutItems]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const rate = PROMO_CODES[appliedPromo as keyof typeof PROMO_CODES] || 0;
    return subtotal * rate;
  }, [subtotal, appliedPromo]);

  const shippingCost = 8;
  const total = subtotal - discount + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code as keyof typeof PROMO_CODES]) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid code');
      setTimeout(() => setPromoError(''), 3000);
    }
  };

  const isFormValid = () => {
    return !!formData.clientName && !!formData.city && !!formData.address && !!formData.phone && formData.phone.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setTouched({
        clientName: true,
        city: true,
        address: true,
        phone: true,
      });
      setError("Please fill in all delivery details correctly.");
      return;
    }

    setIsSubmitting(true);
    const place = `${formData.address}, ${formData.city}`;
    const productSummary = checkoutItems.map(item =>
      `${item.name}${item.concentration ? ` (${item.concentration})` : ''} (${item.quantity} - ${item.size || '50ml'})`
    ).join(', ');
    const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

    try {
      await onSubmitOrder({
        clientName: formData.clientName,
        phoneNumber: formData.phone,
        place: place,
        product: productSummary,
        quantity: totalQuantity,
        items: checkoutItems.map(item => ({
          id: item.productId,
          quantity: item.quantity,
          shippingMethodId: item.shippingMethodId
        })),
        totalPrice: total,
        shippingFee: shippingCost,
        deliveryMethod: 'All Tunisia Delivery',
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error('Checkout failed:', err);
      setError(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        key="checkout-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center p-4 md:p-6"
        style={{ zIndex: 2147483647 }}
      >
        {/* Physical Blocking Shield (Absolute Opacity) */}
        <div className="fixed inset-0 w-full h-full" style={{ backgroundColor: '#000000', opacity: 1, zIndex: -1 }} />
        
        <motion.div
          key="checkout-card"
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0 md:min-h-[600px] max-h-[92vh] z-[2147483647] border border-[#d4af37]/30"
          style={{ backgroundColor: '#050505', WebkitOverflowScrolling: 'touch' }}
        >
          {isSuccess ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center" style={{ backgroundColor: '#050505' }}>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-24 h-24 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-none flex items-center justify-center mb-8"
              >
                <div className="text-[#d4af37]">
                  <ShoppingBag size={48} strokeWidth={1} />
                </div>
              </motion.div>
              <h2 className="text-5xl font-serif text-white mb-6 tracking-widest uppercase">Order Accepted</h2>
              <p className="text-white/50 font-serif italic text-xl mb-10 max-w-md">
                Your selection has been registered. We are preparing your pieces with absolute precision.
              </p>
              <button 
                onClick={onClose}
                className="px-12 py-4 bg-transparent border border-[#d4af37] text-[#d4af37] text-[10px] uppercase font-bold tracking-[0.5em] hover:bg-[#d4af37] hover:text-black transition-all duration-500 rounded-none"
              >
                Return to Boutique
              </button>
            </div>
          ) : (
            <>
          {/* Left Panel: Information */}
          <div 
            className="flex-[1.2] p-6 md:p-10 lg:p-16 border-b md:border-b-0 md:border-r border-[#d4af37]/10 md:overflow-y-auto custom-scrollbar relative z-20"
            style={{ backgroundColor: '#080808', opacity: 1 }}
          >
            <header className="mb-14">
              <button
                onClick={onClose}
                className="flex items-center gap-3 text-white/30 hover:text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black mb-10 transition-colors group"
              >
                <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                Back to Selection
              </button>

              <h1 className="font-serif text-5xl text-white mb-4 tracking-tighter">Shopping Form</h1>
              <div className="h-[1px] w-16 bg-[#d4af37] mb-6" />
              <p className="text-[#d4af37]/60 text-[10px] tracking-[0.3em] uppercase font-medium">Precision Delivery Details</p>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 p-4 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-3"
                  >
                    <X size={14} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                <div className="space-y-3">
                  <label className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black group-focus-within:text-white transition-colors">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, clientName: true }))}
                    required
                    className={`w-full bg-transparent border-b py-3 text-white font-serif text-lg focus:outline-none transition-colors placeholder:text-white/10 ${
                      touched.clientName && !formData.clientName ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                    placeholder="Signature Name"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    required
                    className={`w-full bg-transparent border-b py-3 text-white font-serif text-lg focus:outline-none transition-colors placeholder:text-white/10 ${
                      touched.phone && (!formData.phone || formData.phone.length < 8) ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                    placeholder="+216 -- --- ---"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, city: true }))}
                    required
                    className={`w-full bg-transparent border-b py-3 text-white font-serif text-lg focus:outline-none transition-colors placeholder:text-white/10 ${
                      touched.city && !formData.city ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                    placeholder="Governorate"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[#d4af37] text-[9px] uppercase tracking-[0.4em] font-black">
                    Detailed Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, address: true }))}
                    required
                    className={`w-full bg-transparent border-b py-3 text-white font-serif text-lg focus:outline-none transition-colors placeholder:text-white/10 ${
                      touched.address && !formData.address ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-[#d4af37]'
                    }`}
                    placeholder="Location specificity"
                  />
                </div>
              </div>

              <div className="pt-10 flex gap-6 items-start border-t border-white/5">
                <div className="p-3 bg-[#d4af37]/5 border border-[#d4af37]/20">
                  <ShieldCheck size={24} className="text-[#d4af37]" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-white text-[11px] uppercase tracking-[0.3em] font-black">Guaranteed Authenticity</h4>
                  <p className="text-white/40 text-xs font-serif italic mt-2 leading-relaxed max-w-sm">
                    Each order is curated and verified by Melik Al Ruh artisans within 24 hours to ensure standard-setting excellence.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Right Panel: Summary */}
          <div 
            className="flex-1 p-6 md:p-10 lg:p-16 md:overflow-y-auto custom-scrollbar relative z-20 flex flex-col"
            style={{ backgroundColor: '#050505', opacity: 1 }}
          >
            <h2 className="font-serif text-3xl text-white mb-10 tracking-tight">Selection Summary</h2>

            <div className="flex-grow space-y-8">
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start group pb-6 border-b border-white/5">
                  <div className="flex flex-col">
                    <span className="text-white text-lg font-serif italic tracking-wide group-hover:text-[#d4af37] transition-colors">{item.name}</span>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-white/30 text-[9px] uppercase tracking-[0.3em]">Quantity: {item.quantity}</span>
                      <span className="h-3 w-[1px] bg-white/10" />
                      <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.3em] font-bold">{item.size || '50ml'} Edition</span>
                    </div>
                  </div>
                  <span className="text-white font-serif text-lg">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-14 space-y-10">
              {/* Promo Section */}
              <div className="relative">
                <form onSubmit={applyPromoCode} className="flex gap-4 border-b border-[#d4af37]/20 pb-2 focus-within:border-[#d4af37] transition-all">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="PRIVILEGE CODE"
                    className="flex-1 bg-transparent py-2 text-[10px] text-white focus:outline-none placeholder:text-white/20 tracking-[0.4em] font-black"
                  />
                  <button type="submit" className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors">Apply</button>
                </form>
                {promoError && <p className="text-red-500 text-[8px] mt-2 uppercase tracking-[0.4em] font-bold">{promoError}</p>}
                {appliedPromo && (
                  <div className="flex justify-between items-center mt-4 p-3 bg-[#d4af37]/5 border border-[#d4af37]/20 text-[#d4af37]">
                    <span className="text-[9px] font-black tracking-[0.3em] uppercase">Privilege: {appliedPromo}</span>
                    <button onClick={() => setAppliedPromo(null)} className="text-white/30 hover:text-white transition-colors"><X size={14} /></button>
                  </div>
                )}
              </div>

              {/* Totals Section */}
              <div className="space-y-5">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-medium">
                  <span className="text-white/30">Registry Subtotal</span>
                  <span className="text-white font-serif">{subtotal.toFixed(2)} TND</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-black text-[#d4af37]">
                    <span>Privilege Reduction</span>
                    <span className="font-serif">-{discount.toFixed(2)} TND</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] font-medium">
                  <span className="text-white/30">Signature Logistics</span>
                  <span className="text-white font-serif">{shippingCost.toFixed(2)} TND</span>
                </div>

                <div className="pt-8 border-t border-[#d4af37]/30 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[#d4af37] text-[9px] uppercase tracking-[0.5em] font-black mb-2">Final Investment</span>
                    <span className="text-white font-serif text-4xl leading-none">Total Price</span>
                  </div>
                  <div className="text-right">
                    <span className="text-5xl font-serif text-white">{total.toFixed(2)}</span>
                    <span className="text-[11px] font-sans font-black text-[#d4af37] ml-2 tracking-widest uppercase">TND</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-10 text-xs tracking-[0.6em] font-black uppercase bg-gradient-to-r from-[#d4af37] via-[#f0c952] to-[#d4af37] hover:brightness-110 text-black transition-all rounded-none flex items-center justify-center gap-4 shadow-[0_10px_30px_rgba(212,175,55,0.2)] relative overflow-hidden group border-none"
              >
                <span className="relative z-10 flex items-center gap-4">
                  {isSubmitting ? 'Securing Registry...' : 'Confirm Selection'}
                  {!isSubmitting && <ArrowRight size={20} strokeWidth={3} />}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
              </Button>
            </div>
          </div>
          </>
        )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}