import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Heart, ShoppingCart, MapPin, User, Phone, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { type Product } from '../lib/products';

export interface CartItem {
  id: string; // Composite ID: productId-shippingMethodId (or productId if no method)
  productId: string;
  shippingMethodId?: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
  notes: string;
  size?: string;
  concentration?: string;
  checked?: boolean;
}

export const FRAGRANCE_SIZES = [
  { id: 'size-50', name: '50ml', price: 25 },
  { id: 'size-100', name: '100ml', price: 35 },
];

const PROMO_CODES = {
  'WELCOME10': 0.10,
  'BEY20': 0.20,
  'LUXURY15': 0.15,
};

const SHIPPING_RATES = {
  standard: { name: 'Fixed Rate', price: 8, days: 'All Tunisia Delivery' },
};

interface CartProps {
  items: CartItem[];
  wishlistItems: Product[];
  orders?: { id: string; product: string; quantity: number; status: string; date: string }[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleCheck: (id: string, checked: boolean) => void;
  onUpdateSize: (id: string, size: { id: string; name: string; price: number }) => void;
  onCheckout: () => void;
  onRemoveItem: (id: string) => void;
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (id: string) => void;
  onMoveToCart: (product: Product) => void;
  onOrderSubmit: (orderData: {
    clientName: string;
    phoneNumber: string;
    place: string;
    product: string;
    quantity: number;
    items?: { id: string; quantity: number }[];
    totalPrice?: number;
    shippingFee?: number;
    deliveryMethod?: string;
  }) => Promise<void>;
  currentUser?: { id: string; name: string; email: string } | null;
  products: Product[];
}

type CartStep = 'cart' | 'delivery';

export default function Cart({
  items,
  wishlistItems = [],
  isOpen,
  onClose,
  onUpdateQuantity,
  onToggleCheck,
  onUpdateSize,
  onCheckout,
  onRemoveItem,
  onRemoveFromWishlist,
  onMoveToCart,
  onOrderSubmit,
  currentUser,
  products,
}: CartProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders');
  const [cartStep, setCartStep] = useState<CartStep>('cart');
  
  // Checkout States
  const [formData, setFormData] = useState({
    clientName: currentUser?.name || '',
    city: '',
    address: '',
    phone: '',
  });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [shippingMethod, setShippingMethod] = useState<keyof typeof SHIPPING_RATES>('standard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset step when cart closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCartStep('cart'), 300);
    }
  }, [isOpen]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      if (item.checked === false) return total;
      const priceValue = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return total + priceValue * item.quantity;
    }, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const rate = PROMO_CODES[appliedPromo as keyof typeof PROMO_CODES] || 0;
    return subtotal * rate;
  }, [subtotal, appliedPromo]);

  const shippingCost = 7; // Fixed 7 TND for all Tunisia

  const total = subtotal - discount + shippingCost;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code as keyof typeof PROMO_CODES]) {
      setAppliedPromo(code);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
      setTimeout(() => setPromoError(''), 3000);
    }
  };

  const handleSubmitOrder = async () => {
    // Basic validation
    if (!formData.clientName || !formData.phone || !formData.city || !formData.address) {
      alert('Please fill in all details in the Shopping Formulair');
      return;
    }

    // Filter only checked items
    const selectedItems = items.filter(item => item.checked !== false);
    
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    setIsSubmitting(true);
    try {
      const place = `${formData.address}, ${formData.city}`;
      // Product summary formatted as ProductName (Concentration) (Quantity - Size)
      const productSummary = selectedItems
        .map(item => `${item.name}${item.concentration ? ` (${item.concentration})` : ''} (${item.quantity} - ${item.size || '50ml'})`)
        .join(', ');
      
      const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

      setSubmitError(null);
      await onOrderSubmit({
        clientName: formData.clientName,
        phoneNumber: formData.phone,
        place: place,
        product: productSummary,
        quantity: totalQuantity,
        items: selectedItems.map(item => ({ 
          id: item.productId, 
          name: item.name, // Added for backend name-based fallback
          quantity: item.quantity,
          shippingMethodId: item.shippingMethodId 
        })),
        totalPrice: total,
        shippingFee: shippingCost,
        deliveryMethod: SHIPPING_RATES[shippingMethod].name,
      });
      
      onClose();
    } catch (error: any) {
      console.error('Order submission failed:', error);
      setSubmitError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#050505] border-l border-white/5 z-50 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
          >
            {/* Upper Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent opacity-30" />

            {/* Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3">
                    {cartStep === 'delivery' && (
                      <button 
                        onClick={() => setCartStep('cart')}
                        className="p-2 -ml-2 text-white/50 hover:text-[#d4af37] transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                    )}
                    <h2 className="text-3xl font-serif text-white tracking-wider uppercase">
                      {cartStep === 'cart' ? 'Your Selection' : 'Shopping Formulair'}
                    </h2>
                  </div>
                  <div className="h-0.5 w-12 bg-[#d4af37] mt-2 rounded-full" />
                </div>
                <button
                  onClick={onClose}
                  className="group p-3 text-white/50 hover:text-white transition-all bg-white/5 rounded-full hover:bg-white/10"
                >
                  <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              {/* Tabs (Only visible in Cart step) */}
              {cartStep === 'cart' && (
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6 relative">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 relative z-10 py-3 rounded-lg text-sm font-medium transition-all duration-500 overflow-hidden ${
                      activeTab === 'orders' ? 'text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {activeTab === 'orders' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f0c952]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-20 flex items-center justify-center gap-2">
                      <ShoppingBag size={16} />
                      Orders ({items.length})
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`flex-1 relative z-10 py-3 rounded-lg text-sm font-medium transition-all duration-500 overflow-hidden ${
                      activeTab === 'wishlist' ? 'text-black' : 'text-white/40 hover:text-white'
                    }`}
                  >
                    {activeTab === 'wishlist' && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#f0c952]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-20 flex items-center justify-center gap-2">
                      <Heart size={16} />
                      Wishlist ({wishlistItems.length})
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 overflow-y-auto px-8 custom-scrollbar pb-8">
              <AnimatePresence mode="wait">
                {cartStep === 'cart' ? (
                  <motion.div
                    key="step-cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {activeTab === 'orders' ? (
                      <div className="space-y-6">
                        {items.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-6">
                            <ShoppingCart size={40} className="text-white/10" />
                            <h3 className="text-xl font-serif text-white">Your cart is empty</h3>
                            <Button variant="outline" onClick={onClose}>Continue Shopping</Button>
                          </div>
                        ) : (
                          items.map((item) => (
                            <div 
                              key={item.id} 
                              className={`group relative bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-[#d4af37]/20 transition-all ${
                                item.checked === false ? 'opacity-40 grayscale-[0.5]' : ''
                              }`}
                            >
                              <div className="flex gap-4 sm:gap-6 items-center">
                                {/* Checkbox */}
                                <button
                                  onClick={() => onToggleCheck(item.id, item.checked !== false ? false : true)}
                                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 relative overflow-hidden group/check ${
                                    item.checked !== false 
                                      ? 'bg-gradient-to-br from-[#d4af37] to-[#f0c952] border-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                                      : 'border-white/10 bg-white/5 text-transparent hover:border-white/30'
                                  }`}
                                >
                                  {item.checked !== false ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                      <ShieldCheck size={14} strokeWidth={3} />
                                    </motion.div>
                                  ) : (
                                    <ShoppingCart size={12} className="text-white/10 group-hover/check:text-white/30 transition-colors" />
                                  )}
                                </button>

                                <div className="w-20 h-20 flex-shrink-0 bg-black rounded-xl overflow-hidden border border-white/10">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <h4 className="text-white font-serif text-lg truncate">{item.name}</h4>
                                    <button onClick={() => onRemoveItem(item.id)} className="text-white/30 hover:text-red-400 p-1 transition-colors"><Trash2 size={16} /></button>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-3">
                                    <p className="text-[#d4af37] font-medium">{item.price}</p>
                                    <span className="text-white/20 px-2 py-0.5 rounded-full border border-white/10 text-[10px] uppercase font-bold tracking-widest">{item.size || '50ml'}</span>
                                  </div>

                                  {/* Size Selection Buttons */}
                                  <div className="flex gap-2 mt-3 mb-4">
                                    {(products.find(p => p.id === item.productId)?.shippingMethods || FRAGRANCE_SIZES).map((size) => (
                                      <button
                                        key={size.id}
                                        onClick={() => onUpdateSize(item.id, size)}
                                        className={`text-[9px] uppercase tracking-tighter px-2 py-1 rounded-md border transition-all ${
                                          item.size === size.name
                                            ? 'bg-[#d4af37]/10 border-[#d4af37]/50 text-[#d4af37]'
                                            : 'border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                                        }`}
                                      >
                                        {size.name}
                                      </button>
                                    ))}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 bg-black/40 rounded-full border border-white/10 p-1">
                                      <button 
                                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                                        className="p-1 text-white/50 hover:text-white transition-colors"
                                      >
                                        <Minus size={12} />
                                      </button>
                                      <span className="text-white text-xs w-6 text-center tabular-nums">{item.quantity}</span>
                                      <button 
                                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                                        className="p-1 text-white/50 hover:text-white transition-colors"
                                      >
                                        <Plus size={12} />
                                      </button>
                                    </div>
                                    
                                    {item.checked === false && (
                                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 italic">Saved for later</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        {wishlistItems.map((product) => (
                          <div key={product.id} className="bg-white/5 border border-white/5 rounded-2xl p-5">
                            <div className="flex gap-6">
                              <div className="w-20 h-20 bg-black rounded-xl overflow-hidden"><img src={product.image} className="w-full h-full object-cover" /></div>
                              <div className="flex-1">
                                <h4 className="text-white font-serif">{product.name}</h4>
                                <p className="text-[#d4af37] text-sm mb-3">{product.price}</p>
                                <button onClick={() => onMoveToCart(product)} className="text-xs font-bold uppercase tracking-widest text-[#d4af37] flex items-center gap-2">Move to Cart <ArrowRight size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-delivery"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    {/* Delivery Form */}
                    <div className="space-y-6">
                      {submitError && (
                        <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <X className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                          <div className="space-y-1">
                            <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Order Failed</p>
                            <p className="text-white/70 text-xs leading-relaxed">{submitError}</p>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                            <User size={12} className="text-[#d4af37]" /> Full Name
                          </label>
                          <input 
                            name="clientName" 
                            value={formData.clientName} 
                            onChange={handleFormChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37]/50 outline-none"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                            <Phone size={12} className="text-[#d4af37]" /> Phone Number
                          </label>
                          <input 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleFormChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37]/50 outline-none"
                            placeholder="+216 -- --- ---"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                              <MapPin size={12} className="text-[#d4af37]" /> City
                            </label>
                            <input 
                              name="city" 
                              value={formData.city} 
                              onChange={handleFormChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37]/50 outline-none"
                              placeholder="Tunis"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-widest font-bold">
                              <MapPin size={12} className="text-[#d4af37]" /> Address
                            </label>
                            <input 
                              name="address" 
                              value={formData.address} 
                              onChange={handleFormChange}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-[#d4af37]/50 outline-none"
                              placeholder="Street, Building..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-white font-serif text-lg flex items-center gap-2">
                        <Truck size={18} className="text-[#d4af37]" /> Delivery Method
                      </h3>
                      <div className="bg-[#d4af37]/10 border border-[#d4af37]/50 p-5 rounded-2xl flex items-center justify-between">
                        <div>
                          <p className="text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-1">Standard Shipping</p>
                          <p className="text-white/60 text-sm">All Tunisia Delivery</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-serif text-xl">8.00 TND</p>
                          <p className="text-[#d4af37]/60 text-[10px] uppercase font-bold tracking-widest">Fixed Rate</p>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <input 
                          value={promoCode} 
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="PROMO CODE"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs uppercase tracking-widest outline-none focus:border-[#d4af37]/30"
                        />
                        <button onClick={applyPromoCode} className="px-6 bg-[#d4af37]/10 text-[#d4af37] rounded-xl text-[10px] font-bold border border-[#d4af37]/20 uppercase">Apply</button>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between items-center bg-[#d4af37]/10 p-3 rounded-lg border border-[#d4af37]/20">
                          <span className="text-[#d4af37] text-[10px] font-bold tracking-widest">PROMO {appliedPromo} ACTIVE</span>
                          <button onClick={() => setAppliedPromo(null)} className="text-white/30 hover:text-white"><X size={14} /></button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Summary */}
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && items.length > 0 && (
                <motion.div
                  key={cartStep === 'cart' ? 'footer-cart' : 'footer-delivery'}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="bg-[#080808] border-t border-white/10 p-8 space-y-6 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] relative z-30"
                >
                  {cartStep === 'cart' ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Subtotal</span>
                          <span className="text-white font-serif text-2xl">Selection Total</span>
                        </div>
                        <span className="text-3xl font-serif text-[#d4af37]">{subtotal.toFixed(2)} TND</span>
                      </div>
                       <Button
                        onClick={onCheckout}
                        className="w-full py-7 text-lg tracking-[0.2em] font-serif uppercase bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black hover:scale-[1.02] transition-all rounded-xl shadow-[0_15px_40_rgba(212,175,55,0.25)] flex items-center justify-center gap-4 group"
                      >
                        Proceed to Delivery
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-2 border-b border-white/5 pb-4">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/30">
                          <span>Subtotal</span>
                          <span className="text-white">{subtotal.toFixed(2)} TND</span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-[#d4af37]">
                            <span>Discount</span>
                            <span>-{discount.toFixed(2)} TND</span>
                          </div>
                        )}
                          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/30">
                            <span>Shipping (Tunisia)</span>
                            <span className="text-white">{SHIPPING_RATES.standard.price.toFixed(2)} TND</span>
                          </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-white/20 text-[10px] uppercase tracking-[0.4em] font-black">Final Price</span>
                          <span className="text-white font-serif text-2xl uppercase">Order Total</span>
                        </div>
                        <span className="text-3xl font-serif text-[#d4af37]">{total.toFixed(2)} TND</span>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setCartStep('cart')}
                          className="flex-1 py-7 border-white/10 text-white/50 hover:text-white"
                        >
                          Back
                        </Button>
                        <Button
                          onClick={handleSubmitOrder}
                          disabled={isSubmitting}
                          className="flex-[2] py-7 text-lg tracking-[0.2em] font-serif uppercase bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black hover:scale-[1.02] transition-all rounded-xl shadow-[0_15px_40px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 group"
                        >
                          {isSubmitting ? 'Processing...' : 'Confirm Order'}
                          {!isSubmitting && <ShieldCheck size={20} />}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}