import { motion } from 'motion/react';
import { Button } from './button';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { StarRating3D } from './StarRating3D';

interface ProductCardProps {
  productId?: string;
  name: string;
  notes: string;
  price: string;
  image: string;
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
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        
        {/* Info/Eye Icon (Top Left) */}
        {onViewInfo && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onViewInfo();
            }}
            className="absolute top-4 left-4 z-20 p-3 rounded-sm border backdrop-blur-md bg-black/70 border-white/10 text-white hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye className="w-5 h-5" />
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
            className={`absolute top-4 right-4 z-20 p-3 rounded-sm border backdrop-blur-md transition-all duration-300 ${
              isFavorited 
                ? 'bg-[#d4af37] border-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                : 'bg-black/70 border-white/10 text-white hover:border-[#d4af37]/50 hover:text-[#d4af37]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-black/40 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 min-h-[3.5rem]">
          <h3 className="font-serif text-xl text-white group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-tight flex-1">
            {name}
          </h3>
          <span className="text-[#d4af37] font-medium whitespace-nowrap ml-4 pt-1">{price}</span>
        </div>
        {inspiredBy && (
          <p className="text-[#d4af37] text-xs italic mb-2 -mt-1">Inspired by: {inspiredBy}</p>
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
          <div className="min-h-[1.25rem]">
            <p className="text-white/80 text-sm line-clamp-1 italic font-light">{noteString || 'No notes available'}</p>
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
            className="h-11 border-white/20 text-white hover:bg-white/10 flex items-center justify-center px-4 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 rounded-sm"
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
            className="h-11 bg-gradient-to-r from-[#d4af37] to-[#f0c952] text-black border-none flex items-center justify-center px-4 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-[#d4af37]/20 rounded-sm"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
