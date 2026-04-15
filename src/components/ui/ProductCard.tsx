import { motion } from 'motion/react';
import { useState } from 'react';
import { Button } from './button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ShoppingCart, Heart, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { StarRating3D } from './StarRating3D';

interface ProductCardProps {
  productId?: string;
  name: string;
  notes: string;
  price: string;
  image: string;
  images?: string[];
  inspiredBy?: string;
  rating?: number;
  userRating?: number | null;
  reviewCount?: number;
  isFavorited?: boolean;
  onBuy: () => void;
  onAddToCart?: () => void;
  onView3D?: () => void;
  onToggleWishlist?: () => void;
  onViewInfo?: () => void;
  className?: string;
}

export function ProductCard({
  productId,
  name,
  notes,
  price,
  image,
  images = [],
  inspiredBy,
  rating = 0,
  userRating: userRatingProp = 0,
  reviewCount = 0,
  isFavorited = false,
  onBuy,
  onAddToCart,
  onView3D,
  onToggleWishlist,
  onViewInfo,
  className = ""
}: ProductCardProps) {
  const noteString = Array.isArray(notes) ? (notes as string[]).join(', ') : notes;

  // Build gallery: deduplicated list starting with the main image
  const gallery = [image, ...images.filter(img => img && img !== image)].filter(Boolean);
  const hasMultiple = gallery.length > 1;
  const [imgIndex, setImgIndex] = useState(0);

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i - 1 + gallery.length) % gallery.length);
  };
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex(i => (i + 1) % gallery.length);
  };

  return (
    <motion.div
      className={`group relative flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-sm overflow-hidden hover:border-[#d4af37]/50 transition-all duration-500 shadow-lg shadow-black/50 ${className}`}
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden bg-black/20">
        <ImageWithFallback
          src={gallery[imgIndex] || image}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Gallery arrows — only when multiple images exist */}
        {hasMultiple && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImgIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-[#d4af37]' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Info/Eye Icon (Top Left) */}
        {onViewInfo && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewInfo();
            }}
            className="absolute top-4 left-4 z-20 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white hover:bg-black/80 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-4 h-4" />
          </motion.button>
        )}

        {/* Heart Toggle Button */}
        {onToggleWishlist && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleWishlist();
            }}
            className={`absolute top-4 right-4 z-20 p-2 backdrop-blur-sm rounded-full transition-all ${
              isFavorited
                ? 'bg-[#d4af37] text-black'
                : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 bg-black/40 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 min-h-[3.5rem]">
          <h3 translate="no" className="product-title notranslate font-serif text-base sm:text-xl font-semibold text-white group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-tight flex-1">
            {name}
          </h3>
          <span className="text-[#d4af37] font-bold whitespace-nowrap ml-4 pt-1">{price}</span>
        </div>
        {inspiredBy && (
          <p translate="no" className="product-subtitle notranslate text-[#d4af37] text-[10px] italic mb-2 -mt-1 font-medium">Inspired by: {inspiredBy}</p>
        )}
        
        {/* Rating Row (Now moved below the name for better readability as requested) */}
        <div className="mb-4 min-h-[24px] flex items-center">
          {productId ? (
            <StarRating3D
              productId={productId}
              initialRating={Number(rating)}
              userRating={userRatingProp || 0}
              reviewCount={reviewCount}
              showText={true}
            />
          ) : (
            <div className="flex items-center gap-1.5 h-6">
              <span className="text-white/20 text-[10px] uppercase tracking-widest">No rating available</span>
            </div>
          )}
        </div>

        <div className="mb-6 flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white/40 text-xs uppercase tracking-widest font-light">Notes:</span>
          </div>
          <div className="min-h-[1.5rem]">
            <p className="text-white text-sm line-clamp-2 italic font-light">{noteString || 'No notes available'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto pt-6 items-stretch">
          <Button 
            variant="outline" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBuy();
            }}
            className="h-11 border-white/20 text-white hover:bg-white/10 flex items-center justify-center px-4 text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 rounded-sm"
          >
            Buy Now
          </Button>
          <Button 
            variant="primary" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="h-11 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black border-none flex items-center justify-center px-4 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-lg shadow-[#d4af37]/20 rounded-sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
