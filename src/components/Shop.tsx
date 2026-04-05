import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './ui/Navigation';
import { ProductCard } from './ui/ProductCard';
import { ProductViewer3D } from './ProductViewer3D';
import { ProductDetailModal } from './ProductDetailModal';
import { Footer } from './ui/Footer';
import { Filter, Search as SearchIcon, X } from 'lucide-react';
import { type Product } from '../lib/products';
import { type Product as ApiProduct } from '../types';
import { getFragrances } from '../lib/api';
import Search from './Search';

interface ShopProps {
  onNavigate: (page: 'home' | 'story' | 'shop' | 'admin') => void;
  onBuyProduct: (productId: string, productName: string, price: string, shippingMethodId?: string, sizeName?: string, concentration?: string) => void;
  onAddToCart: (product: Product, selectedSize?: { id: string; name: string; price: number }) => void;
  products: Product[];
  cartItemsCount: number;
  onCartOpen: () => void;
  currentUser?: { id: string; name: string; email: string } | null;
  onLoginClick?: () => void;
  onAccountClick?: () => void;
  onLogout?: () => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  wishlistItems: Product[];
  onToggleWishlist: (product: Product) => void;
}

type GenderFilter = 'All' | 'Man' | 'Woman' | 'Unisex';
type FragranceTypeFilter = 'All' | 'Aquatic' | 'Citrus' | 'Floral' | 'Fresh' | 'Fruity' | 'Musky' | 'Oriental' | 'Spicy' | 'Sweet' | 'Woody';
type ProductTypeFilter = 'All' | 'extrait_parfum' | 'original_parfum' | 'accessoire';

export default function Shop({ onNavigate, onBuyProduct, onAddToCart, products: initialProducts, cartItemsCount, onCartOpen, currentUser, onLoginClick, onAccountClick, onLogout, isAdmin, onAdminClick, wishlistItems, onToggleWishlist }: ShopProps) {
  const [activeGender, setActiveGender] = useState<GenderFilter>('All');
  const [activeFragrance, setActiveFragrance] = useState<FragranceTypeFilter>('All');
  const [activeProductType, setActiveProductType] = useState<ProductTypeFilter>('All');
  const [selected3DProduct, setSelected3DProduct] = useState<Product | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [inspiredBySearch, setInspiredBySearch] = useState('');
  const [detailModalProduct, setDetailModalProduct] = useState<ApiProduct | null>(null);
  const [modalMode, setModalMode] = useState<'info' | 'purchase'>('info');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getFragrances();
        setApiProducts(data);
      } catch (err) {
        console.error('Failed to fetch fragrances', err);
      }
    };
    fetchProducts();
  }, []);

  const displayProducts: Product[] = apiProducts.length > 0 ? apiProducts.map(ap => {
    const defaultSize = ap.shippingMethods?.find(sm => sm.name === '50ml');
    const displayPrice = defaultSize ? `${defaultSize.price} TND` : (ap.price ? `${ap.price} TND` : '25 TND');

    return {
      id: ap.id,
      name: ap.name,
      price: displayPrice,
      image: ap.mainImage || '',
      images: ap.galleryImages || [],
      category: ap.category || 'Fresh',
      genderCategory: (ap.genderCategory as any) || 'Unisex',
      tags: ap.tags || [],
      notes: (ap.notes && ap.notes.join(', ')) || '',
      description: ap.description || '',
      rating: Number(ap.rating) || 0,
      reviewCount: ap.reviewCount || 0,
      brand: ap.brand || 'Hama Fragrance',
      inspiredBy: ap.inspiredBy || '',
      productType: ap.productType,
    };
  }) : initialProducts;

  const filteredProducts = displayProducts.filter(p => {
    const matchGender = activeGender === 'All' ? true : (p as any).genderCategory?.toLowerCase() === activeGender.toLowerCase();
    const matchFragrance = activeFragrance === 'All' ? true : (p.category || '').toLowerCase() === activeFragrance.toLowerCase();
    const searchLow = inspiredBySearch.toLowerCase().trim();
    const matchSearch = searchLow === '' ? true : (
      (p.name || '').toLowerCase().includes(searchLow) ||
      (p.brand || '').toLowerCase().includes(searchLow) ||
      (p.inspiredBy || '').toLowerCase().includes(searchLow)
    );
    const matchType = activeProductType === 'All' ? true : p.productType === activeProductType;
    return matchGender && matchFragrance && matchSearch && matchType;
  });

  const genderCategories: GenderFilter[] = ['All', 'Man', 'Woman', 'Unisex'];
  const fragranceCategories: FragranceTypeFilter[] = ['All', 'Aquatic', 'Citrus', 'Floral', 'Fresh', 'Fruity', 'Musky', 'Oriental', 'Spicy', 'Sweet', 'Woody'];
  
  const productTypeCategories: { label: string; value: ProductTypeFilter }[] = [
    { label: 'All', value: 'All' },
    { label: 'Extrait de Parfum', value: 'extrait_parfum' },
    { label: 'Parfum Original', value: 'original_parfum' },
    { label: 'Accessoires', value: 'accessoire' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation
        onNavigate={onNavigate}
        currentPage="shop"
        cartItemsCount={cartItemsCount}
        onCartOpen={onCartOpen}
        currentUser={currentUser}
        onLoginClick={onLoginClick}
        onAccountClick={onAccountClick}
        onAdminClick={onAdminClick}
        isAdmin={isAdmin}
        onLogout={onLogout}
      />

      <div className="pt-24 px-6 lg:px-12 py-16">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[#d4af37] text-sm uppercase tracking-[0.4em] font-bold mb-4 block"
                >
                  Our Collection
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-serif text-white mb-6"
                >
                  Find Your <span className="italic text-[#d4af37]">Signature</span>
                </motion.h1>
              </div>

              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative group w-full md:w-80">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#d4af37] transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="Search by name, brand or scent..."
                    value={inspiredBySearch}
                    onChange={(e) => setInspiredBySearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#d4af37]/50 transition-all placeholder:text-white/20 text-sm"
                  />
                  {inspiredBySearch && (
                    <button
                      onClick={() => setInspiredBySearch('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="mt-12 space-y-6">
              {/* Gender Filter */}
              <div className="flex flex-col items-start gap-3">
                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Filter By Gender:</span>
                <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 overflow-x-auto no-scrollbar gap-2 w-max max-w-full">
                  {genderCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveGender(cat)}
                      className={`px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeGender === cat
                          ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'text-white/50 hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fragrance Type Filter */}
              <div className="flex flex-col items-start gap-3">
                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Fragrance Category:</span>
                <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 overflow-x-auto no-scrollbar w-max max-w-full gap-2">
                  {fragranceCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveFragrance(cat)}
                      className={`px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeFragrance === cat
                          ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'text-white/50 hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Type Filter */}
              <div className="flex flex-col items-start gap-3">
                <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">Product Type:</span>
                <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 overflow-x-auto no-scrollbar w-max max-w-full gap-2">
                  {productTypeCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setActiveProductType(cat.value)}
                      className={`px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeProductType === cat.value
                          ? 'bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                          : 'text-white/50 hover:text-white'
                        }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="flex flex-col flex-1 h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                  >
                    <ProductCard
                      className="flex-1"
                      productId={product.id}
                      name={product.name}
                      notes={product.notes}
                      price={product.price}
                      image={product.image}
                      inspiredBy={product.inspiredBy}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      isFavorited={wishlistItems.some(item => item.id === product.id)}
                      onBuy={() => {
                        const fullProduct = apiProducts.find(p => p.id === product.id);
                        if (fullProduct) {
                          setDetailModalProduct(fullProduct);
                          setModalMode('purchase');
                        }
                      }}
                      onAddToCart={() => {
                        const fullProduct = apiProducts.find(p => p.id === product.id);
                        if (fullProduct) {
                          onAddToCart({
                            ...product,
                            images: fullProduct.galleryImages || []
                          });
                        }
                      }}
                      onView3D={() => setSelected3DProduct(product)}
                      onToggleWishlist={() => onToggleWishlist(product)}
                      onViewInfo={() => {
                        const fullProduct = apiProducts.find(p => p.id === product.id);
                        if (fullProduct) {
                          setDetailModalProduct(fullProduct);
                          setModalMode('info');
                        }
                      }}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center border border-dashed border-white/10 rounded-sm bg-white/5">
                  <p className="text-white/30 text-lg uppercase tracking-widest">No fragrances found Matching your criteria</p>
                  <button
                    onClick={() => { setActiveGender('All'); setActiveFragrance('All'); setActiveProductType('All'); setInspiredBySearch(''); }}
                    className="mt-6 text-[#d4af37] border-b border-[#d4af37]/30 pb-1 hover:border-[#d4af37] transition-all uppercase text-[10px] tracking-widest font-bold"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <Footer />

      {selected3DProduct && (
        <ProductViewer3D
          product={{
            name: selected3DProduct.name,
            image: selected3DProduct.image,
            price: parseFloat(selected3DProduct.price.replace(/[^0-9.]/g, '')),
            description: selected3DProduct.description
          }}
          onClose={() => setSelected3DProduct(null)}
        />
      )}

      {detailModalProduct && (
        <ProductDetailModal
          product={detailModalProduct}
          isOpen={!!detailModalProduct}
          onClose={() => setDetailModalProduct(null)}
          onAddToCart={onAddToCart}
          onBuy={onBuyProduct}
          viewMode={modalMode}
        />
      )}
    </div>
  );
}