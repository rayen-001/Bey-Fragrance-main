import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Navigation } from './ui/Navigation';
import { Button } from './ui/button';
import { Footer } from './ui/Footer';
import { ProductCard } from './ui/ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { type Product } from '../lib/products';
import { getFragrances } from '../lib/api';
import { type Product as ApiProduct } from '../types/index';
import logoImage from 'figma:asset/fcafee10bea948a581eab1432c896c711480b206.png';

interface LandingProps {
  onNavigate: (page: 'home' | 'story' | 'shop' | 'admin') => void;
  cartItemsCount?: number;
  onCartOpen?: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  wishlistItems?: Product[];
  onToggleWishlist?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function Landing({ onNavigate, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onLogout, isAdmin, onAdminClick, wishlistItems = [], onToggleWishlist, onAddToCart }: LandingProps) {
  const [featured, setFeatured] = useState<ApiProduct[]>([]);
  const [totalFragrances, setTotalFragrances] = useState<number>(283);
  const [viewingProduct, setViewingProduct] = useState<ApiProduct | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFragrances();
        setTotalFragrances(data.length);
        // Sort by rating descending, pick top 3
        const sorted = [...data].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
        const topRating = Number(sorted[0]?.rating) || 0;
        const topGroup = sorted.filter(p => Number(p.rating) === topRating);
        if (topGroup.length > 3) {
          // Shuffle and pick 3 from top-rated group
          const shuffled = topGroup.sort(() => Math.random() - 0.5);
          setFeatured(shuffled.slice(0, 3));
        } else {
          setFeatured(sorted.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch featured fragrances', err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1510] to-[#000000] relative overflow-hidden">
      <Navigation
        onNavigate={onNavigate}
        currentPage="home"
        cartItemsCount={cartItemsCount}
        onCartOpen={onCartOpen}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
        onLogout={onLogout}
        isAdmin={isAdmin}
      />

      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="luxury-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="1" fill="#d4af37" />
              <circle cx="0" cy="0" r="1" fill="#d4af37" />
              <circle cx="100" cy="100" r="1" fill="#d4af37" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#luxury-pattern)" />
        </svg>
      </div>

      {/* Main Content - Centered */}
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center px-6 relative">

        {/* Animated Mist Layers */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-[#d4af37]/10 via-transparent to-transparent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-radial from-transparent via-[#d4af37]/5 to-transparent"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.3, 0.6, 0.3],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Rotating Rings */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, rgba(212,175,55,0.15), transparent)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute w-[500px] h-[500px] border border-[#d4af37]/20 rounded-full"
          animate={{
            rotate: -360,
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Light Rays */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={`ray-${i}`}
            className="absolute top-1/2 left-1/2 w-1 h-96 origin-bottom"
            style={{
              background: 'linear-gradient(to top, rgba(212,175,55,0), rgba(212,175,55,0.15), rgba(212,175,55,0))',
              transform: `rotate(${(360 / 16) * i}deg)`,
            }}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scaleY: [1, 1.3, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Logo with Enhanced Animation */}
        <motion.div
          className="relative z-10 mb-8"
          initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
          animate={{
            scale: 1,
            opacity: 1,
            rotate: 0,
          }}
          transition={{
            duration: 2.5,
            delay: 0.2,
            type: "spring",
            stiffness: 80,
          }}
        >
          {/* Multiple Glow Layers */}
          <motion.div
            className="absolute inset-0 blur-[100px]"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.6), transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 blur-[60px]"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.8), transparent 60%)',
            }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.img
            src={logoImage}
            alt="Hama Fragrance"
            className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain relative z-10"
            style={{
              filter: "drop-shadow(0 0 100px rgba(212,175,55,0.8)) drop-shadow(0 0 50px rgba(212,175,55,0.5)) drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
            }}
            animate={{
              y: [0, -20, 0],
              rotateY: [0, 8, 0, -8, 0],
            }}
            transition={{
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          className="text-center mb-48 relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-[#d4af37] font-display text-xs tracking-[0.3em] uppercase relative">
              <span className="absolute -left-10 top-1/2 w-8 h-px bg-gradient-to-r from-transparent to-[#d4af37]" />
              Luxury Perfumery
              <span className="absolute -right-10 top-1/2 w-8 h-px bg-gradient-to-l from-transparent to-[#d4af37]" />
            </p>
          </motion.div>

          <h1 className="font-serif text-2xl lg:text-3xl xl:text-4xl text-white mb-4 leading-tight px-4">
            <span className="gold-gradient-text">A scent that tells your story</span>
          </h1>

          <div className="ornament-divider my-4">
            <span>✦</span>
          </div>

          <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-6 max-w-lg mx-auto font-light px-4">
            Discover handcrafted fragrances inspired by <span className="text-[#d4af37]">memory</span>,
            <span className="text-[#d4af37]"> travel</span>, and
            <span className="text-[#d4af37]"> elegance</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button variant="primary" onClick={() => onNavigate('shop')}>
              Shop Collection
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('story')}>
              Our Story
            </Button>
          </div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              left: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, #d4af37, transparent)`,
            }}
            initial={{
              y: '100vh',
              opacity: 0,
            }}
            animate={{
              y: [0, -300, -600],
              x: [0, Math.random() * 150 - 75, Math.random() * 150 - 75],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Sparkle Effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-3 h-3"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${15 + Math.random() * 70}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-[#d4af37] rotate-45 blur-sm" />
            <div className="absolute inset-0 w-full h-full bg-[#d4af37] -rotate-45 blur-sm" />
          </motion.div>
        ))}

        {/* Bottom Features Bar */}
        <motion.div
          className="absolute bottom-6 left-0 right-0 flex justify-center pb-safe"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12 px-6 py-4 sm:py-6 bg-black/40 backdrop-blur-md border border-[#d4af37]/20 rounded-sm">
            <motion.div
              className="text-center min-w-[100px]"
              whileHover={{ y: -5 }}
            >
              <p className="text-[#d4af37] font-serif text-xl sm:text-2xl mb-1">100%</p>
              <p className="text-white/50 text-xs sm:text-sm font-display tracking-wider">AUTHENTIC</p>
            </motion.div>
            <div className="hidden sm:block w-px bg-white/10" />
            <motion.div
              className="text-center min-w-[100px]"
              whileHover={{ y: -5 }}
            >
              <p className="text-[#d4af37] font-serif text-xl sm:text-2xl mb-1">{totalFragrances}</p>
              <p className="text-white/50 text-xs sm:text-sm font-display tracking-wider">FRAGRANCES</p>
            </motion.div>
            <div className="hidden sm:block w-px bg-white/10" />
            <motion.div
              className="text-center min-w-[100px]"
              whileHover={{ y: -5 }}
            >
              <p className="text-[#d4af37] font-serif text-xl sm:text-2xl mb-1">Tunisia</p>
              <p className="text-white/50 text-xs sm:text-sm font-display tracking-wider">HANDCRAFTED</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator - Removed to avoid overlap */}
      </div>

      {/* Featured Fragrances Section */}
      {featured.length === 0 && (
        <div className="w-full max-w-7xl mx-auto py-24 relative z-10">
          <div className="text-center mb-16">
            <div className="h-8 w-48 bg-white/5 rounded-sm mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-64 bg-white/5 rounded-sm mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-sm overflow-hidden animate-pulse">
                <div className="h-80 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="h-4 bg-white/5 rounded w-2/3" />
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="h-11 bg-white/5 rounded-sm" />
                    <div className="h-11 bg-[#d4af37]/10 rounded-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {featured.length > 0 && (
        <div className="w-full max-w-7xl mx-auto py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl lg:text-4xl text-white mb-4">
              <span className="gold-gradient-text">Best Sellers</span>
            </h2>
            <div className="ornament-divider mt-2 mb-4"><span>✦</span></div>
            <p className="text-white/60 text-sm lg:text-base tracking-wide uppercase">Our most beloved signature scents</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 lg:px-12">
            {featured.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  productId={p.id}
                  name={p.name}
                  notes={p.notes && p.notes.join(', ')}
                  price={p.price.toString() + ' TND'}
                  image={p.mainImage || ''}
                  images={p.galleryImages || []}
                  rating={Number(p.rating) || 0}
                  reviewCount={p.reviewCount || 0}
                  isFavorited={wishlistItems.some(item => item.id === p.id)}
                  onBuy={() => onNavigate('shop')}
                  onAddToCart={() => {
                    const product = {
                      id: p.id,
                      name: p.name,
                      price: p.price.toString() + ' TND',
                      image: p.mainImage || '',
                      notes: (p.notes && p.notes.join(', ')) || '',
                      category: (p.category as any) || 'Fresh',
                    } as Product;
                    onAddToCart?.(product);
                  }}
                  onToggleWishlist={() => {
                    const product = {
                      id: p.id,
                      name: p.name,
                      price: p.price.toString() + ' TND',
                      image: p.mainImage || '',
                      notes: (p.notes && p.notes.join(', ')) || '',
                      category: (p.category as any) || 'Fresh',
                    } as Product;
                    onToggleWishlist?.(product);
                  }}
                  onViewInfo={() => setViewingProduct(p)}
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="outline" onClick={() => onNavigate('shop')}>
              View Entire Collection
            </Button>
          </div>
        </div>
      )}

      <Footer />

      {viewingProduct && (
        <ProductDetailModal
          product={viewingProduct}
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          onAddToCart={(product, selectedSize) => {
            const p = {
              id: product.id,
              name: product.name,
              price: selectedSize ? String(selectedSize.price) + ' TND' : (String(product.price) || '22 TND'),
              image: product.mainImage || '',
              notes: (product.notes && product.notes.join(', ')) || '',
              category: (product.category as any) || 'Fresh',
            } as Product;
            onAddToCart?.(p);
          }}
          onBuy={() => onNavigate('shop')}
          viewMode="purchase"
        />
      )}
    </div>
  );
}