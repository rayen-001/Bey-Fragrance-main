import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search as SearchIcon, X, TrendingUp } from 'lucide-react';
import { type Product } from '../lib/products';
import { ProductCard } from './ui/ProductCard';

interface SearchProps {
  products: Product[];
  onBuyProduct: (productId: string, productName: string, price: string) => void;
  onAddToCart: (product: Product) => void;
  onViewInfo: (product: Product) => void;
}

export default function Search({ products, onBuyProduct, onAddToCart, onViewInfo }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const popularSearches = ['Oud', 'Fresh', 'Floral', 'Woody', 'Aquatic', 'Citrus', 'Musky', 'Spicy'];

  const filteredProducts = searchQuery.trim()
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.inspiredBy || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <SearchIcon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" 
            size={20} 
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, brand or scent..."
            className="w-full bg-white/5 border border-white/10 rounded-sm pl-12 pr-12 py-4 text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Popular Searches */}
        {!isSearching && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <TrendingUp size={16} />
              <span>Popular:</span>
            </div>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/70 hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-colors"
              >
                {term}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8"
          >
            {filteredProducts.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-white/70">
                    Found <span className="text-[#d4af37] font-serif">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <ProductCard
                        name={product.name}
                        notes={product.notes}
                        price={product.price}
                        image={product.image}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        onBuy={() => onBuyProduct(product.id, product.name, product.price)}
                        onAddToCart={() => onAddToCart(product)}
                        onViewInfo={() => onViewInfo(product)}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <SearchIcon size={40} className="text-white/20" />
                </div>
                <h3 className="text-white text-xl font-serif mb-2">No Results Found</h3>
                <p className="text-white/50 mb-6">
                  We couldn't find any fragrances matching "{searchQuery}"
                </p>
                
                {/* Suggestions */}
                <div className="max-w-md mx-auto">
                  <p className="text-white/70 text-sm mb-4">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-sm text-white/70 hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
