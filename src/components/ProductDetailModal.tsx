import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Product } from '../types';
import { StarRating3D } from './ui/StarRating3D';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: any, selectedSize?: { id: string; name: string; price: number }) => void;
  onBuy: (productId: string, productName: string, price: string, shippingMethodId?: string, sizeName?: string, concentration?: string) => void;
  viewMode?: 'info' | 'purchase';
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart, onBuy, viewMode = 'purchase' }: ProductDetailModalProps) {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(
    product.shippingMethods && product.shippingMethods.length > 0 
      ? (product.shippingMethods.find(sm => sm.name === '50ml')?.id || product.shippingMethods[0].id)
      : null
  );
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [product.mainImage, ...(product.galleryImages || [])].filter(Boolean) as string[];

  if (!isOpen) return null;

  const selectedSize = product.shippingMethods?.find(sm => sm.id === selectedSizeId);
  const displayPrice = selectedSize ? selectedSize.price : (product.price || '25');

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isPurchaseMode = viewMode === 'purchase';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 md:p-12 transition-all"
        style={{ zIndex: 9999999, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#050505] border border-[#d4af37]/20 rounded-2xl w-full max-w-6xl shadow-2xl relative flex flex-col md:flex-row max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Exit Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-4 right-4 z-[100000000] bg-black/40 hover:bg-[#d4af37] text-white hover:text-black p-1.5 rounded-full border border-white/10 transition-all cursor-pointer group"
          >
            <X size={16} strokeWidth={2} />
          </button>

          {/* Left Side: Gallery */}
          <div className="w-full md:w-1/2 relative bg-[#0a0a0a] min-h-[400px] md:h-auto overflow-hidden border-r border-white/5 group">
             <div className="absolute inset-0 p-8 flex items-center justify-center">
                <AnimatePresence mode="wait">
                   <motion.img
                     key={currentImageIndex}
                     src={images[currentImageIndex]}
                     alt={product.name}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.4 }}
                     className="max-w-[85%] max-h-[85%] object-contain select-none"
                     style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}
                   />
                </AnimatePresence>
             </div>

             {images.length > 1 && (
               <>
                 <button 
                   onClick={handlePrevImage}
                   className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-[#d4af37] text-white hover:text-black rounded-full opacity-0 group-hover:opacity-100 transition-all"
                 >
                   <ChevronLeft size={20} />
                 </button>
                 <button 
                   onClick={handleNextImage}
                   className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/40 hover:bg-[#d4af37] text-white hover:text-black rounded-full opacity-0 group-hover:opacity-100 transition-all"
                 >
                   <ChevronRight size={20} />
                 </button>
                 <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                   {images.map((_, i) => (
                     <div 
                       key={i} 
                       className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-[#d4af37] w-4' : 'bg-white/20'}`} 
                     />
                   ))}
                 </div>
               </>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent pointer-events-none" />
          </div>

          {/* Right Side: Info */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col bg-[#050505] text-white">
            <div className="mb-8">
              <span className="text-[#d4af37] text-[10px] uppercase font-bold tracking-[0.4em] mb-2 block">
                {product.brand}
              </span>
              <h2 className="text-white font-serif text-3xl lg:text-4xl leading-tight mb-4">
                {product.name}
              </h2>

              {product.productType !== 'accessoire' && (
                <div className="flex gap-3 mb-6">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-[#d4af37] uppercase tracking-widest">
                    {product.genderCategory || 'Unisex'}
                  </span>
                  {product.category && (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold text-white/60 uppercase tracking-widest">
                      {product.category}
                    </span>
                  )}
                </div>
              )}

              {/* 3D Star Rating + Price Row */}
              <div className="flex justify-between items-center py-4 border-y border-white/5">
                <StarRating3D
                  productId={product.id}
                  initialRating={Number(product.rating) || 0}
                  reviewCount={product.reviewCount || 0}
                  showText={true}
                />

                {isPurchaseMode && (
                  <div className="text-2xl font-serif text-[#d4af37] leading-none">
                    {displayPrice} <span className="text-[10px] font-sans font-bold text-[#d4af37]/60">TND</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-10 flex-grow">
              {isPurchaseMode && product.shippingMethods && product.shippingMethods.length > 0 && (
                <section>
                  <div className="text-[#d4af37] text-xs uppercase tracking-[0.4em] font-black mb-4">Select Bottle Size</div>
                  <div className="flex gap-3">
                    {product.shippingMethods.map((sm) => (
                      <button
                        key={sm.id}
                        onClick={() => setSelectedSizeId(sm.id)}
                        className={`flex-1 py-3 border transition-all rounded-sm text-[10px] font-bold tracking-widest ${
                          selectedSizeId === sm.id 
                            ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:border-[#d4af37]/50 hover:text-white'
                        }`}
                      >
                        {sm.name}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="text-[#d4af37] text-xs uppercase tracking-[0.4em] font-black mb-4">Description</div>
                <p className="text-white/80 leading-relaxed font-serif text-lg italic font-light">
                  {product.description || "A masterpiece fragrance."}
                </p>
              </section>

              <section>
                <div className="text-[#d4af37] text-xs uppercase tracking-[0.4em] font-black mb-4">Fragrance Notes</div>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-sm text-white/50 text-[9px] uppercase tracking-widest">
                      {note}
                    </span>
                  ))}
                </div>
              </section>

              <div className="py-2">
                <h3 className="text-white/20 text-xs uppercase tracking-[0.3em] font-bold mb-2">Inspired By</h3>
                <p className="text-white text-[11px] font-bold uppercase tracking-widest">{product.inspiredBy || 'Original'}</p>
              </div>
            </div>

            {isPurchaseMode && (
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    const s = product.shippingMethods?.find(m => m.id === selectedSizeId);
                    onBuy(
                      product.id, 
                      product.name, 
                      s ? String(s.price) + ' TND' : (String(product.price) || '22 TND'),
                      s?.id || undefined,
                      s?.name || undefined,
                      product.concentration || undefined
                    );
                  }}
                  className="flex-1 h-12 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37] hover:text-black tracking-[0.3em] text-[10px] font-black uppercase rounded-sm transition-all"
                >
                  Buy Now
                </button>
                <button
                  onClick={() => {
                    const s = product.shippingMethods?.find(m => m.id === selectedSizeId);
                    onAddToCart(product, s ? { id: s.id, name: s.name, price: Number(s.price) } : undefined);
                  }}
                  disabled={product.stockQuantity <= 0}
                  className="flex-1 h-12 bg-[#d4af37] text-black hover:bg-white tracking-[0.3em] text-[10px] font-black uppercase rounded-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <ShoppingBag size={14} />
                  Add To Collection
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
